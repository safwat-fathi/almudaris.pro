
## 2024-05-18 - [TypeORM Full Table Scan Anti-Pattern]
**Learning:** Found a TypeORM anti-pattern in `backend/src/homework/homework.service.ts`: `find({ where: ids.length ? { id: In(ids) } : {} })`. When `ids` is empty, it evaluates to `find({ where: {} })` which queries ALL records in the table, rather than returning no records as intended. This causes massive performance degradation on empty associations.
**Action:** Always wrap `In()` array queries with an array length check and return early or return an empty array without hitting the database: `const items = ids.length > 0 ? await repo.find({ where: { id: In(ids) } }) : [];`.
