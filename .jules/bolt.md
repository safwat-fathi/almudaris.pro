## 2024-05-18 - [TypeORM Full Table Scan Anti-Pattern]
**Learning:** Found a TypeORM anti-pattern in `backend/src/homework/homework.service.ts`: `find({ where: ids.length ? { id: In(ids) } : {} })`. When `ids` is empty, it evaluates to `find({ where: {} })` which queries ALL records in the table, rather than returning no records as intended. This causes massive performance degradation on empty associations.
**Action:** Always wrap `In()` array queries with an array length check and return early or return an empty array without hitting the database: `const items = ids.length > 0 ? await repo.find({ where: { id: In(ids) } }) : [];`.

## 2024-05-01 - O(n²) nested loop in data aggregations
**Learning:** Found a common anti-pattern in the NestJS backend where related entities (e.g. submissions mapped to students, attachments mapped to submissions) are joined in memory using `.find()` inside a `.map()`. This creates an O(n²) time complexity bottleneck for large datasets like homework submissions.
**Action:** When aggregating or associating bulk data fetched from TypeORM repositories in memory, always pre-compute lookups using Hash Maps (e.g., `new Map()`) keyed by the relational IDs. This drops the nested iteration to an O(n) lookup and improves response times for list endpoints.
