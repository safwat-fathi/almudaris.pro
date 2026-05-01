# Research: Grade System Standardization

## Decision: Backend-owned canonical grade model

**Decision**: Centralize `EducationStage`, allowed-year rules, validation helpers, and Arabic label formatting in a backend shared grade module.

**Rationale**: The backend is the source of truth for persistence constraints, API validation, and `grade_label` responses. This prevents frontend-generated labels from drifting across dashboards, filters, and integrations.

**Alternatives considered**: Frontend-owned labels were rejected because requirements explicitly require backend-provided formatted labels. Per-feature duplicated helpers were rejected because they would create inconsistent validation.

## Decision: Teacher assignments are stage-level permissions

**Decision**: Teachers are assigned one or more broad education stages, not exact stage/year combinations.

**Rationale**: The clarified business examples are stage-level: `مدرس ثانوي` or `مدرس ثانوي و اعدادي`. Stage-level permissions are simpler for teachers and admins while still allowing each Group to select exactly one stage/year.

**Alternatives considered**: Exact stage/year teacher permissions were rejected as too granular for the requested workflow. Optional year restrictions were deferred because no current requirement needs them.

## Decision: Groups store exact stage/year and validate against teacher stages

**Decision**: Every Group stores exactly one `education_stage` and one `education_year`; group save operations reject a stage outside the assigned teacher stages.

**Rationale**: Groups are the scheduling and organization unit. Exact group targeting is required even when teacher permissions are broader.

**Alternatives considered**: Deriving Group stage/year from students was rejected because group creation must select stage/year before students are necessarily assigned. Allowing multi-stage groups was rejected by clarification.

## Decision: Sessions inherit Group targeting unless existing schema proves otherwise

**Decision**: Treat Sessions as strictly targeted to one stage/year through their owning Group unless implementation discovery finds an independent Session grade field already in use.

**Rationale**: The spec requires sessions to be single stage/year. Deriving from Group avoids duplicated persistence and reduces mismatch risk.

**Alternatives considered**: Independent Session columns were rejected for initial planning because they add synchronization rules without an explicit business need.

## Decision: `UNASSIGNED` uses year `0` for migration/manual-review records

**Decision**: The database constraint must allow `education_stage = UNASSIGNED` with `education_year = 0`, while canonical stages keep their standard Egyptian year ranges.

**Rationale**: Clarifications require un-mappable legacy records to be preserved and flagged for manual review. Without this allowance, migration can fail on historical data.

**Alternatives considered**: Null values were rejected because they weaken filtering and validation. Silent coercion to a real grade was rejected because it pollutes data.

## Decision: Existing Group/Homework records default to `UNASSIGNED` when unmappable

**Decision**: Existing records without reliable stage/year values are migrated to `UNASSIGNED`, year `0`, and are blocked from normal stage/year-targeted workflows until reviewed where applicable.

**Rationale**: This preserves records without inventing grade data. It also provides a consistent rollout path for all entities touched by stage/year constraints.

**Alternatives considered**: Bulk assigning to Secondary was rejected as inaccurate. Blocking migration until all records are cleaned manually was rejected as operationally risky.

## Decision: Frontend forms use Server Actions with Zod validation

**Decision**: All frontend forms that submit `education_stage`, `education_year`, or teacher assigned stages validate with Zod before sending data to backend services.

**Rationale**: This is constitution-mandated and improves user feedback while backend validation remains authoritative.

**Alternatives considered**: UI-only validation was rejected because users can bypass controls. Backend-only validation was rejected because it weakens UX and violates the constitution.
