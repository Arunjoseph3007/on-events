/* #### IMPORTANT #####
What you are seeing is cursed.
Please dont assume its standard way to use express.
This is really breaking every best practice there is.
But the idea is you can directly pass drizzle queries to res.paginateQuery with ordering info and it will handle the rest
Not sure if this level of coupling is usefull/harmful.
Not sure about the performance implications due to using subquery
Not sure how to test just queries without controllers
*/
import { SQL, count } from "drizzle-orm";
import type { PgColumn, PgSelect } from "drizzle-orm/pg-core";
import db from "../db";
import { Request } from "express";
import type { Express } from "express";

declare module "express-serve-static-core" {
  interface Response {
    /**
     * This method just adds a next page feild to the pagination result
     *
     * @param payload Pagination result returned by withPagination function
     * @returns
     */
    paginate: <TData>(payload: TPaginationResult<TData>) => void;
    /**
     * ### IMPORTANT: USE WITH CAUTION
     * Takes in a query and coulmns to sort the result, executes the query and
     * sends back a pagination response with current page no, page size, nexUrl, etc.
     *
     * @param qb Drizzle query to be executed (should be dynamic query)
     * @param orderByColumn Sort based on these (eg `desc(users.id)`)
     * @param pageSize Optionally pass in a page size (default to 20)
     * @returns
     *
     * @example
     * ```ts
     * app.get("/", async (req, res) => {
     *   const query = db
     *     .select()
     *     .from(posts)
     *     .where(eq(posts.userId, userId))
     *     .$dynamic();
     *
     *   await res.paginateQuery(query, desc(posts.createdAt));
     * });
     * ```
     */
    paginateQuery: <TQuery extends PgSelect>(
      qb: TQuery,
      orderByColumn: PgColumn | SQL | SQL.Aliased,
      pageSize?: number
    ) => Promise<void>;
  }
}

export type TPaginationResult<TData> = {
  data: TData;
  page: number;
  pageSize: number;
  hasMore: boolean;
  noOfPages: number;
};

export type TPaginationResponse<TData> = TPaginationResult<TData> & {
  next: string | null;
};

export function setupPagination(app: Express) {
  app.response.paginate = function <T>(payload: TPaginationResult<T>) {
    this.status(200).json(getPaginationResponse(payload, this.req));
  };

  app.response.paginateQuery = async function <TQuery extends PgSelect>(
    qb: TQuery,
    orderByColumn: PgColumn | SQL | SQL.Aliased,
    pageSize = 20
  ) {
    let page = 1;
    if (this.req.query.page && typeof this.req.query.page == "string") {
      page = +this.req.query.page;
    }
    const result = await withPagination(qb, orderByColumn, page, pageSize);

    const response = getPaginationResponse(result, this.req);

    this.status(200).json(response);
  };
}

export default async function withPagination<TQuery extends PgSelect>(
  qb: TQuery,
  orderByColumn: PgColumn | SQL | SQL.Aliased,
  page: number,
  pageSize = 20
): Promise<TPaginationResult<Awaited<TQuery>>> {
  const subQuery = qb.as("subQuery");

  const totalRecordsResult = await db
    .select({ count: count() })
    .from(subQuery)
    .execute();
  const totalRecords = totalRecordsResult[0].count;
  const noOfPages = Math.ceil(totalRecords / pageSize);

  const data = await qb
    .orderBy(orderByColumn)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return {
    data,
    page,
    pageSize,
    noOfPages,
    hasMore: totalRecords > (page - 1) * pageSize + data.length,
  };
}

export function getPaginationResponse<TData>(
  result: TPaginationResult<TData>,
  req: Request
): TPaginationResponse<TData> {
  let next = null;

  if (result.hasMore) {
    console.log("hello", result.hasMore);

    const url = new URL(req.url, req.protocol + "://" + req.headers.host);
    url.searchParams.set("page", (result.page + 1).toString());
    next = url.toString();
  }

  return {
    ...result,
    next,
  };
}
