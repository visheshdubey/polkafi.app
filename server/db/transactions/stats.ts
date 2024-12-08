import { get, isEmpty } from "lodash";

import { TransactionFindManyWhere } from ".";
import { TransactionType } from "@prisma/client";
import prisma from "../prisma";

interface TimeFrame {
    start: Date;
    end: Date;
}

interface ChartData {
    key: string;
    debit: number;
    credit: number;
}

const handleTransactionTypeFilter = (value: TransactionType[]): TransactionFindManyWhere => {
    if (isEmpty(value)) {
        return;
    }

    const type = get(value, "[0]", "").toUpperCase();

    if (type !== TransactionType.CREDIT && type !== TransactionType.DEBIT) {
        return;
    }

    return {
        OR: [
            {
                type: {
                    equals: type as TransactionType,
                },
            },
        ],
    };
};

const handleTransactionCategoryFilter = (value: string): TransactionFindManyWhere => {
    if (isEmpty(value)) {
        return;
    }

    return {
        OR: [
            {
                category: {
                    id: {
                        equals: get(value, "[0]"),
                    },
                },
            },
        ],
    };
};

export async function getDashboardStats(userId: string, dayRange: number, searchQueryParams: any) {
    const timeFrame = getTimeFrameForRange(dayRange);
    const interval = getIntervalForRange(dayRange);

    const where: TransactionFindManyWhere = {
        AND: [
            handleTransactionTypeFilter(searchQueryParams["type"]) || {},
            handleTransactionCategoryFilter(searchQueryParams["category"]) || {},
            { userId },
            {
                createdAt: {
                    gte: timeFrame.start,
                    lte: timeFrame.end
                }
            }
        ],
    };

    const totals = await prisma.transaction.groupBy({
        by: ['type'],
        where,
        _sum: {
            amount: true
        }
    });

    const totalCredit = totals.find((t: { type: TransactionType }) =>
        t.type === TransactionType.CREDIT)?._sum.amount?.toString() || '0';

    const totalDebit = totals.find((t: { type: TransactionType }) =>
        t.type === TransactionType.DEBIT)?._sum.amount?.toString() || '0';

    const chartData = await getChartData(userId, timeFrame, interval);

    return {
        charts: chartData,
        totalCredit,
        totalDebit,
        netPnl: Number(totalCredit) - Number(totalDebit)
    };
}

function getTimeFrameForRange(days: number): TimeFrame {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return { start, end };
}

function getIntervalForRange(days: number): string {
    switch (days) {
        case 1:
            return '2 hours';
        case 7:
            return '14 hours';
        case 30:
            return '2.5 days';
        case 90:
            return '7.5 days';
        case 180:
            return '15 days';
        case 365:
            return '1 month';
        default:
            return '1 day';
    }
}

async function getChartData(userId: string, timeFrame: TimeFrame, interval: string): Promise<ChartData[]> {
    if (interval === '1 month') {
        const results = await prisma.$queryRaw<Array<{
            time_bucket: Date;
            debit: bigint;
            credit: bigint;
        }>>`
        WITH RECURSIVE months AS (
            SELECT date_trunc('month', ${timeFrame.end}::timestamp) AS time_bucket
            UNION ALL
            SELECT date_trunc('month', time_bucket - interval '1 month')
            FROM months
            WHERE time_bucket > date_trunc('month', ${timeFrame.start}::timestamp) 
        )
        SELECT 
            months.time_bucket,
            COALESCE(SUM(CASE WHEN type = 'DEBIT' THEN amount ELSE 0 END), 0) as debit,
            COALESCE(SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE 0 END), 0) as credit
        FROM months
        LEFT JOIN "Transaction" ON 
            date_trunc('month', "Transaction"."createdAt") = months.time_bucket
            AND "Transaction"."userId" = ${userId}
        GROUP BY months.time_bucket
        ORDER BY time_bucket DESC
        LIMIT 12`;

        return results.map(row => ({
            key: formatTimeKey(row.time_bucket, interval),
            debit: Number(row.debit),
            credit: Number(row.credit)
        }));
    }

    const results = await prisma.$queryRaw<Array<{
        time_bucket: Date;
        debit: bigint;
        credit: bigint;
    }>>`
    WITH time_series AS (
        SELECT generate_series(
            date_trunc('day', ${timeFrame.start}::timestamp),
            date_trunc('day', ${timeFrame.end}::timestamp),
            ${interval}::interval
        ) AS time_bucket
    )
    SELECT 
        time_bucket,
        COALESCE(SUM(CASE WHEN type = 'DEBIT' THEN amount ELSE 0 END), 0) as debit,
        COALESCE(SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE 0 END), 0) as credit
    FROM time_series
    LEFT JOIN "Transaction" ON 
        "Transaction"."createdAt" >= time_bucket
        AND "Transaction"."createdAt" < CASE 
            WHEN time_bucket = date_trunc('day', ${timeFrame.start}::timestamp)
            THEN time_bucket + ${interval}::interval
            ELSE LEAST(time_bucket + ${interval}::interval, ${timeFrame.end}::timestamp)
        END
        AND "Transaction"."userId" = ${userId}
    GROUP BY time_bucket
    ORDER BY time_bucket DESC
    LIMIT 12`;

    return results.map(row => ({
        key: formatTimeKey(row.time_bucket, interval),
        debit: Number(row.debit),
        credit: Number(row.credit),
    }));
}

function formatTimeKey(date: Date, interval: string): string {
    if (interval === '2 hours') {
        return ((date.getHours() % 12) || 12).toString();
    }
    if (interval === '1 month') {
        return date.toLocaleString('default', { month: 'short' }).slice(0, 3);
    }
    return date.getDate().toString();
} 