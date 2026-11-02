# Database verification

Database checks are available in version 2 suites and the `database_query` tool. They verify application state as part of the same test case; they are not migration, administration or data-cleanup tools.

## Adapter matrix

SQLite uses Node's bundled `node:sqlite`. Install only the optional driver you need under `<workspace>/tools/database`. The table lists package versions checked for this release. Compatibility with another server/version still needs validation in your environment.

| `driver` | Databases / protocol | Open-source client package | Bound parameters | Connection value |
| --- | --- | --- | --- | --- |
| `sqlite` | SQLite file within workspace | Built-in `node:sqlite` | `?` | `file` path, no credentials |
| `postgres` | PostgreSQL; protocol-compatible servers require qualification | `pg@8.23.1` | `$1`, `$2` | URI or JSON pg Client configuration |
| `mysql` | MySQL / MariaDB | `mysql2@3.24.6` | `?` | URI or JSON connection configuration |
| `mssql` | SQL Server / Azure SQL | `mssql@12.7.13` | `@p1`, `@p2` | Connection string or JSON configuration |
| `oracle` | Oracle Database | `oracledb@26.0.0` | `:1`, `:2` | JSON `{user,password,connectString}`; Thin mode by default |
| `mongodb` | MongoDB | `mongodb@7.8.0` | Structured `filter`, operation `find` | MongoDB URI; optional target `database` |
| `redis` | Redis | `redis@6.3.1` | `key`, operation `get` | `redis://` / `rediss://` URI |
| `odbc` | Compatible SQL databases through an installed vendor ODBC driver | `odbc@2.6.0` | Usually `?`, vendor-dependent | ODBC connection string / DSN |

ODBC provides an extension path for DB2, warehouse products and other SQL engines with compatible vendor drivers. It does not guarantee every database/dialect. Native ODBC build prerequisites, driver licensing, DSN configuration, authentication, platform/architecture and server dialect must be checked separately. Proprietary database servers and vendor drivers do not become open source because their client adapter is open source.

Direct adapters are implemented for the eight listed driver kinds. Do not label a server as certified from protocol similarity alone. SQL Server, Oracle and ODBC require environment-specific integration validation; the repository's service test can use explicitly supplied test connections. A missing optional package produces an actionable error and never installs software during MCP startup or a test.

## Install a driver

For PostgreSQL, PowerShell:

```powershell
npm.cmd install --prefix C:/InfiTests/tools/database --save-exact --no-audit --no-fund pg@8.23.1
```

For MySQL/MariaDB, use the same command with `mysql2@3.24.6`. Other package names and pinned versions are listed above. Run `database_capabilities` or `doctor` after installation. A package installed elsewhere on the computer is not necessarily resolvable from this workspace.

Provide connection credentials through your MCP client's environment configuration or an approved secret store. Do not commit credentials or paste them into a suite, requirement document or public report. `connectionEnv` names the variable; it does not contain its value. Use a database-enforced **read-only account** restricted to the required test tables/collections/keys.

## SQL example in a mixed suite

```json
{
  "targets": {
    "records": {"kind": "database", "driver": "postgres", "connectionEnv": "TEST_POSTGRES_URL", "timeoutMs": 10000, "maxRows": 100}
  }
}
```

After an API step captures `orderId`, use:

```json
{
  "kind": "database", "target": "records", "name": "Verify the persisted order",
  "sql": "SELECT id, status FROM orders WHERE id = $1",
  "params": ["${vars.orderId}"],
  "expect": {"rowCount": 1, "checks": [{"path": "rows.0.status", "equals": "created"}], "maxDurationMs": 500}
}
```

Use your driver's placeholder syntax. Column case/types follow its driver; Oracle aliases can be double-quoted to preserve lowercase names. Numeric/decimal/timestamp representations can vary: assert the actual documented driver representation rather than coercing values silently.

Each SQL operation accepts one SELECT without comments, multiple statements, interpolation, common write commands or known dangerous external-access functions. CTEs, stored procedures, arbitrary SQL scripts and writes are intentionally not exposed. This conservative SQL guard is not a complete SQL security parser: SELECT can call user-defined functions on some servers. Database permissions and isolation are the security boundary. PostgreSQL/MySQL/Oracle sessions also use supported read-only session/transaction settings; SQLite is opened read-only with query-only enabled and extension loading disabled.

Results exceeding `maxRows` fail rather than silently passing against truncated data. Narrow your query or raise the explicit bound (maximum 10000). SQL wrappers bound returned rows for PostgreSQL/MySQL/SQL Server; Oracle uses maxRows, SQLite bounded iteration and MongoDB a limit. ODBC drivers may materialize results before the row cap is checked; keep queries bounded in their dialect. Row order is not implicit: use an explicit ORDER BY when comparing ordered results.

## MongoDB and Redis examples

```json
{"kind":"database","target":"documents","name":"Read order document","operation":"find","collection":"orders","filter":{"id":"${vars.orderId}"},"expect":{"rowCount":1,"checks":[{"path":"rows.0.status","equals":"created"}]}}
```

The target uses `driver: "mongodb"`, `connectionEnv` and optional `database`. Executable/write operators such as `$where`, `$function`, `$out` and `$merge` are blocked. Only `find` is exposed; use a server read-only role.

```json
{"kind":"database","target":"cache","name":"Read order cache","operation":"get","key":"order:${vars.orderId}","expect":{"rowCount":1,"checks":[{"path":"rows.0.value","contains":"created"}]}}
```

The Redis target uses `driver: "redis"` and `connectionEnv`. A missing key returns zero rows; a value returns `{key,value}`. Only GET is exposed. Restrict Redis ACL commands/key patterns too.

## Timing, timeouts and failure evidence

`connectMs` measures establishment of the connection; `queryMs` measures query/read and result receipt; `totalMs` includes worker startup/transport and teardown. `expect.maxDurationMs` asserts query time, while target `timeoutMs` bounds the entire operation. A timed-out worker is terminated and its connection closes. Remote server cancellation depends on its driver/server: also configure server-side statement/resource limits for expensive queries. Missing drivers, credentials, failed assertions, connection errors and row-limit breaches fail the step.

Recorded JSON is redacted by sensitive field names, configured `redactKeys`, and known environment-secret values. Application data in other fields still needs review before sharing. There is no database screenshot; the report links structured evidence and its actual timing.

## Validate against your servers

The CI service job exercises PostgreSQL, MySQL, MongoDB and Redis using disposable synthetic containers. Local core checks exercise real SQLite. `scripts/verify-database-services.mjs` also accepts `INFI_TEST_MSSQL`, `INFI_TEST_ORACLE` and `INFI_TEST_ODBC`; absence is reported as not exercised. The script never reports an unconfigured server passed. Optional MongoDB/Redis setup writes only synthetic disposable fixture data and removes it afterwards; adapter calls remain read-only.
