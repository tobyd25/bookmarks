export interface DbClient {
    get: (sql: string, params?: any[]) => any;
      all: (sql: string, params?: any[]) => any[];
      run: (sql: string, params?: any[]) => any;
}