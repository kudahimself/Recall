/**
 * SQL for Data Engineering (T-SQL) — canonical within-topic learning order.
 *
 * Mirrors backendOrderedQuestions.ts: the q(id) helper throws on an unknown id
 * (so a typo fails the build), and the exported array defines the ramp order the
 * spaced-repetition selector serves. Pillars are added here as each is authored;
 * within a topic the order is faded → cold (MCQ → CLOZE/PARSONS → CODING).
 *
 * See SQL_FOR_DE_COURSE_SPEC.md.
 */
import { Question } from '../types';
import { tsql_select_questions } from './topic_tsql_select';
import { tsql_filtering_questions } from './topic_tsql_filtering';
import { tsql_string_functions_questions } from './topic_tsql_string_functions';
import { tsql_date_functions_questions } from './topic_tsql_date_functions';
import { tsql_joins_questions } from './topic_tsql_joins';
import { tsql_aggregation_questions } from './topic_tsql_aggregation';
import { tsql_subqueries_cte_questions } from './topic_tsql_subqueries_cte';
import { tsql_set_ops_questions } from './topic_tsql_set_ops';
import { tsql_dml_questions } from './topic_tsql_dml';
import { tsql_windows_questions } from './topic_tsql_windows';
import { tsql_window_frames_questions } from './topic_tsql_window_frames';
import { tsql_lag_lead_questions } from './topic_tsql_lag_lead';
import { tsql_grouping_sets_questions } from './topic_tsql_grouping_sets';
import { tsql_pivot_questions } from './topic_tsql_pivot';
import { tsql_ddl_tables_questions } from './topic_tsql_ddl_tables';
import { tsql_types_questions } from './topic_tsql_types';
import { tsql_constraints_questions } from './topic_tsql_constraints';
import { tsql_views_questions } from './topic_tsql_views';
import { tsql_transactions_questions } from './topic_tsql_transactions';
import { tsql_isolation_questions } from './topic_tsql_isolation';
import { tsql_procedures_questions } from './topic_tsql_procedures';
import { tsql_control_flow_questions } from './topic_tsql_control_flow';
import { tsql_error_handling_questions } from './topic_tsql_error_handling';
import { tsql_facts_dims_questions } from './topic_tsql_facts_dims';
import { tsql_surrogate_keys_questions } from './topic_tsql_surrogate_keys';
import { tsql_star_schema_questions } from './topic_tsql_star_schema';
import { tsql_scd_questions } from './topic_tsql_scd';
import { tsql_normalization_questions } from './topic_tsql_normalization';
import { tsql_insert_questions } from './topic_tsql_insert';
import { tsql_merge_questions } from './topic_tsql_merge';
import { tsql_dedup_questions } from './topic_tsql_dedup';
import { tsql_etl_proc_questions } from './topic_tsql_etl_proc';
import { tsql_incremental_questions } from './topic_tsql_incremental';
import { tsql_quality_questions } from './topic_tsql_quality';
import { tsql_indexes_questions } from './topic_tsql_indexes';
import { tsql_execution_plans_questions } from './topic_tsql_execution_plans';
import { tsql_partitioning_questions } from './topic_tsql_partitioning';
import { tsql_columnstore_questions } from './topic_tsql_columnstore';
import { tsql_antipatterns_questions } from './topic_tsql_antipatterns';
import { tsql_mpp_model_questions } from './topic_tsql_mpp_model';
import { tsql_synapse_fabric_questions } from './topic_tsql_synapse_fabric';
import { tsql_other_warehouses_questions } from './topic_tsql_other_warehouses';

const allQuestions: Question[] = [
  ...tsql_select_questions,
  ...tsql_filtering_questions,
  ...tsql_string_functions_questions,
  ...tsql_date_functions_questions,
  ...tsql_joins_questions,
  ...tsql_aggregation_questions,
  ...tsql_subqueries_cte_questions,
  ...tsql_set_ops_questions,
  ...tsql_dml_questions,
  ...tsql_windows_questions,
  ...tsql_window_frames_questions,
  ...tsql_lag_lead_questions,
  ...tsql_grouping_sets_questions,
  ...tsql_pivot_questions,
  ...tsql_ddl_tables_questions,
  ...tsql_types_questions,
  ...tsql_constraints_questions,
  ...tsql_views_questions,
  ...tsql_transactions_questions,
  ...tsql_isolation_questions,
  ...tsql_procedures_questions,
  ...tsql_control_flow_questions,
  ...tsql_error_handling_questions,
  ...tsql_facts_dims_questions,
  ...tsql_surrogate_keys_questions,
  ...tsql_star_schema_questions,
  ...tsql_scd_questions,
  ...tsql_normalization_questions,
  ...tsql_insert_questions,
  ...tsql_merge_questions,
  ...tsql_dedup_questions,
  ...tsql_etl_proc_questions,
  ...tsql_incremental_questions,
  ...tsql_quality_questions,
  ...tsql_indexes_questions,
  ...tsql_execution_plans_questions,
  ...tsql_partitioning_questions,
  ...tsql_columnstore_questions,
  ...tsql_antipatterns_questions,
  ...tsql_mpp_model_questions,
  ...tsql_synapse_fabric_questions,
  ...tsql_other_warehouses_questions,
];

const qMap = new Map<string, Question>();
for (const question of allQuestions) qMap.set(question.id, question);
function q(id: string): Question {
  const found = qMap.get(id);
  if (!found) throw new Error(`SQL question not found: ${id}`);
  return found;
}

export const sqlOrderedQuestions: Question[] = [
  // ===== PILLAR 1: QUERYING FOUNDATIONS =====
  // SELECT, WHERE, ORDER BY, TOP, OFFSET/FETCH, DISTINCT
  q('tsql-select-mcq-1'), q('tsql-select-predict-1'), q('tsql-select-cloze-1'),
  q('tsql-select-distinct-mcq-1'), q('tsql-select-offset-mcq-1'), q('tsql-select-1'),
  q('tsql-select-offset-cloze-1'), q('tsql-select-2'),
  // Filtering, NULLs & CASE
  q('tsql-filter-mcq-1'), q('tsql-filter-predict-1'), q('tsql-filter-cloze-1'),
  q('tsql-filter-iif-mcq-1'),
  q('tsql-filter-coalesce-mcq-1'), q('tsql-filter-predict-2'),
  q('tsql-filter-case-cloze-1'), q('tsql-filter-1'),
  // String Functions
  q('tsql-str-concat-mcq-1'), q('tsql-str-len-cloze-1'), q('tsql-str-case-cloze-1'),
  q('tsql-str-trim-cloze-1'), q('tsql-str-substring-predict-1'), q('tsql-str-leftright-cloze-1'),
  q('tsql-str-replace-predict-1'), q('tsql-str-charindex-mcq-1'),
  q('tsql-str-substring-len-cloze-1'), q('tsql-str-1'), q('tsql-str-2'),
  q('tsql-str-domain-cloze-1'), q('tsql-str-3'),
  // Date & Time Functions
  q('tsql-dt-getdate-mcq-1'), q('tsql-dt-yearmonthday-cloze-1'), q('tsql-dt-cast-cloze-1'),
  q('tsql-dt-datediff-predict-1'), q('tsql-dt-eomonth-predict-1'), q('tsql-dt-datepart-cloze-1'),
  q('tsql-dt-datediff-age-cloze-1'), q('tsql-dt-format-mcq-1'), q('tsql-dt-format-cloze-1'),
  q('tsql-dt-eomonth-datediff-cloze-1'), q('tsql-dt-1'), q('tsql-dt-2'), q('tsql-dt-3'),
  // Joins
  q('tsql-joins-mcq-1'), q('tsql-joins-mcq-2'), q('tsql-joins-right-mcq-1'), q('tsql-joins-cross-mcq-1'),
  q('tsql-joins-predict-1'), q('tsql-joins-cloze-1'),
  q('tsql-joins-leftjoin-cloze-1'), q('tsql-joins-selfjoin-mcq-1'),
  q('tsql-joins-1'), q('tsql-joins-2'), q('tsql-joins-3'),
  // Aggregation & GROUP BY
  q('tsql-agg-mcq-1'), q('tsql-agg-predict-1'), q('tsql-agg-minmaxavg-predict-1'), q('tsql-agg-cloze-1'),
  q('tsql-agg-having-cloze-1'), q('tsql-agg-distinct-predict-1'), q('tsql-agg-1'),
  // Subqueries & CTEs
  q('tsql-subq-mcq-1'), q('tsql-subq-cte-cloze-1'), q('tsql-subq-predict-1'),
  q('tsql-subq-exists-cloze-1'), q('tsql-subq-recursive-mcq-1'), q('tsql-subq-1'),
  q('tsql-subq-recursive-cloze-1'), q('tsql-subq-2'),
  // Set Operations
  q('tsql-setops-mcq-1'), q('tsql-setops-predict-1'), q('tsql-setops-cloze-1'),
  q('tsql-setops-mcq-2'), q('tsql-setops-except-cloze-1'), q('tsql-setops-1'),
  // Basic DML (INSERT / UPDATE / DELETE) — placed last in the pillar since its
  // advanced tier builds on JOINS and SUBQUERIES_CTE, taught earlier here.
  q('tsql-dml-insert-mcq-1'), q('tsql-dml-insert-cloze-1'), q('tsql-dml-update-cloze-1'),
  q('tsql-dml-delete-cloze-1'), q('tsql-dml-nowhere-mcq-1'),
  q('tsql-dml-update-predict-1'), q('tsql-dml-delete-predict-1'),
  q('tsql-dml-insert-multirow-cloze-1'), q('tsql-dml-update-expr-cloze-1'),
  q('tsql-dml-truncate-mcq-1'), q('tsql-dml-1'), q('tsql-dml-2'),
  q('tsql-dml-delete-subquery-cloze-1'), q('tsql-dml-updatejoin-cloze-1'),
  q('tsql-dml-3'), q('tsql-dml-4'),

  // ===== PILLAR 2: DDL & CONSTRAINTS (pilot section) =====
  // Creating & Altering Tables — faded → cold
  q('tsql-ddl-create-mcq-1'), q('tsql-ddl-create-cloze-1'), q('tsql-ddl-create-1'),
  q('tsql-ddl-drop-mcq-1'),
  q('tsql-ddl-alter-mcq-1'), q('tsql-ddl-alter-cloze-1'),
  q('tsql-ddl-temp-mcq-1'),
  q('tsql-ddl-selectinto-cloze-1'), q('tsql-ddl-selectinto-1'),
  // Data Types
  q('tsql-types-mcq-1'), q('tsql-types-mcq-2'), q('tsql-types-bigint-mcq-1'), q('tsql-types-cloze-1'),
  // Constraints (PK, FK, CHECK)
  q('tsql-constraints-mcq-1'), q('tsql-constraints-cloze-1'),
  q('tsql-constraints-fk-cloze-1'), q('tsql-constraints-check-cloze-1'),
  q('tsql-constraints-unique-cloze-1'), q('tsql-constraints-1'),
  // Views & Computed Columns
  q('tsql-views-mcq-1'), q('tsql-views-cloze-1'), q('tsql-views-1'),
  q('tsql-views-computed-cloze-1'),

  // ===== PILLAR 3: ANALYTICAL & WINDOW SQL =====
  // Window functions (ROW_NUMBER / RANK / DENSE_RANK / NTILE)
  q('tsql-windows-mcq-1'), q('tsql-windows-predict-1'), q('tsql-windows-predict-2'),
  q('tsql-windows-cloze-1'), q('tsql-windows-mcq-2'), q('tsql-windows-ntile-cloze-1'),
  q('tsql-windows-1'),
  // Window frames & running totals
  q('tsql-frames-mcq-1'), q('tsql-frames-predict-1'), q('tsql-frames-cloze-1'),
  q('tsql-frames-1'), q('tsql-frames-movingavg-cloze-1'), q('tsql-frames-2'),
  // LAG / LEAD & period-over-period
  q('tsql-laglead-mcq-1'), q('tsql-laglead-predict-1'), q('tsql-laglead-cloze-1'),
  q('tsql-laglead-lead-predict-1'), q('tsql-laglead-firstvalue-mcq-1'),
  q('tsql-laglead-mcq-2'), q('tsql-laglead-1'),
  // GROUPING SETS / ROLLUP / CUBE
  q('tsql-gs-mcq-1'), q('tsql-gs-cloze-1'), q('tsql-gs-cube-cloze-1'), q('tsql-gs-1'),
  q('tsql-gs-groupingsets-cloze-1'), q('tsql-gs-groupingfn-cloze-1'), q('tsql-gs-2'),
  // PIVOT & conditional aggregation
  q('tsql-pivot-mcq-1'), q('tsql-pivot-predict-1'), q('tsql-pivot-cloze-1'),
  q('tsql-pivot-native-cloze-1'), q('tsql-pivot-unpivot-mcq-1'), q('tsql-pivot-1'),

  // ===== PILLAR 4: TRANSACTIONS & PROCEDURAL T-SQL =====
  // Transactions (BEGIN TRAN / COMMIT / ROLLBACK / XACT_ABORT)
  q('tsql-tran-mcq-1'), q('tsql-tran-cloze-1'), q('tsql-tran-predict-1'),
  q('tsql-tran-xact-mcq-1'), q('tsql-tran-trancount-mcq-1'), q('tsql-tran-1'),
  q('tsql-tran-savetran-cloze-1'),
  // Isolation levels & locking
  q('tsql-iso-mcq-1'), q('tsql-iso-mcq-2'), q('tsql-iso-cloze-1'),
  q('tsql-iso-cloze-2'), q('tsql-iso-mcq-3'), q('tsql-iso-mcq-4'),
  // Stored procedures
  q('tsql-proc-mcq-1'), q('tsql-proc-cloze-1'), q('tsql-proc-parsons-1'),
  q('tsql-proc-output-mcq-1'), q('tsql-proc-outparam-cloze-1'), q('tsql-proc-exec-cloze-1'),
  q('tsql-proc-return-cloze-1'), q('tsql-proc-1'), q('tsql-proc-2'),
  // Control flow & functions
  q('tsql-flow-mcq-1'), q('tsql-flow-go-mcq-1'), q('tsql-flow-predict-1'), q('tsql-flow-while-predict-1'),
  q('tsql-flow-cloze-1'), q('tsql-flow-func-mcq-1'), q('tsql-flow-func-cloze-1'), q('tsql-flow-1'),
  q('tsql-flow-tvf-cloze-1'),
  // Error handling (TRY…CATCH)
  q('tsql-err-mcq-1'), q('tsql-err-predict-1'), q('tsql-err-cloze-1'),
  q('tsql-err-throw-mcq-1'), q('tsql-err-parsons-1'), q('tsql-err-1'),

  // ===== PILLAR 5: DATA MODELING IN SQL =====
  // Facts & dimensions, grain, measures, degenerate dims
  q('tsql-facts-mcq-1'), q('tsql-facts-mcq-2'), q('tsql-facts-mcq-3'),
  q('tsql-facts-cloze-1'), q('tsql-facts-mcq-4'), q('tsql-facts-1'),
  // Surrogate keys (IDENTITY / SEQUENCE / natural vs surrogate / date dim)
  q('tsql-surr-cloze-1'), q('tsql-surr-mcq-1'), q('tsql-surr-mcq-2'),
  q('tsql-surr-sequence-cloze-1'), q('tsql-surr-mcq-3'), q('tsql-surr-1'),
  // Star schema, snowflake, conformed dims
  q('tsql-star-mcq-1'), q('tsql-star-mcq-2'), q('tsql-star-mcq-3'),
  q('tsql-star-cloze-1'), q('tsql-star-1'),
  // Slowly Changing Dimensions (Type 1 / Type 2 via MERGE)
  q('tsql-scd-mcq-1'), q('tsql-scd-mcq-2'), q('tsql-scd-cloze-1'),
  q('tsql-scd-parsons-1'), q('tsql-scd-1'), q('tsql-scd-2'), q('tsql-scd-insert-cloze-1'),
  // Normalization vs denormalization tradeoffs
  q('tsql-norm-mcq-1'), q('tsql-norm-mcq-2'), q('tsql-norm-mcq-3'),
  q('tsql-norm-mcq-4'), q('tsql-norm-mcq-5'),

  // ===== PILLAR 6: ELT & TRANSFORMATION PATTERNS =====
  // INSERT / INSERT…SELECT / SELECT…INTO / OUTPUT
  q('tsql-insert-mcq-1'), q('tsql-insert-cloze-1'), q('tsql-insert-mcq-2'),
  q('tsql-insert-output-cloze-1'), q('tsql-insert-1'),
  // MERGE (upsert)
  q('tsql-merge-mcq-1'), q('tsql-merge-mcq-2'), q('tsql-merge-cloze-1'),
  q('tsql-merge-cloze-2'), q('tsql-merge-bysource-cloze-1'),
  q('tsql-merge-output-cloze-1'), q('tsql-merge-1'),
  // Deduplication (ROW_NUMBER + WHERE rn = 1)
  q('tsql-dedup-mcq-1'), q('tsql-dedup-predict-1'), q('tsql-dedup-cloze-1'),
  q('tsql-dedup-delete-cloze-1'), q('tsql-dedup-1'),
  // Staging → target load procedures (FIRST-CLASS)
  q('tsql-etlproc-mcq-1'), q('tsql-etlproc-cloze-1'), q('tsql-etlproc-mcq-2'),
  q('tsql-etlproc-parsons-1'), q('tsql-etlproc-mcq-3'),
  q('tsql-etlproc-runlog-cloze-1'),
  q('tsql-etlproc-1'), q('tsql-etlproc-2'), q('tsql-etlproc-3'),
  // Incremental loads (high-watermark, late-arriving data)
  q('tsql-incr-mcq-1'), q('tsql-incr-cloze-1'), q('tsql-incr-1'),
  q('tsql-incr-mcq-2'), q('tsql-incr-lookback-cloze-1'),
  // Data quality checks
  q('tsql-quality-mcq-1'), q('tsql-quality-mcq-2'), q('tsql-quality-cloze-1'),
  q('tsql-quality-1'), q('tsql-quality-2'),

  // ===== PILLAR 7: PERFORMANCE & OPTIMIZATION =====
  // Indexes (clustered, nonclustered, composite, covering/INCLUDE)
  q('tsql-idx-mcq-1'), q('tsql-idx-mcq-2'), q('tsql-idx-mcq-3'),
  q('tsql-idx-mcq-4'), q('tsql-idx-cloze-1'), q('tsql-idx-1'),
  q('tsql-idx-mcq-5'),
  // Execution plans (seek/scan, key lookup, statistics IO/TIME, cardinality)
  q('tsql-plan-cloze-1'), q('tsql-plan-mcq-1'), q('tsql-plan-mcq-3'),
  q('tsql-plan-mcq-2'), q('tsql-plan-mcq-4'),
  // Partitioning (elimination, switching)
  q('tsql-part-mcq-1'), q('tsql-part-cloze-1'), q('tsql-part-scheme-cloze-1'),
  q('tsql-part-mcq-2'), q('tsql-part-mcq-3'), q('tsql-part-switch-cloze-1'), q('tsql-part-1'),
  // Columnstore (batch mode, rowgroup elimination)
  q('tsql-col-mcq-1'), q('tsql-col-mcq-3'), q('tsql-col-cloze-1'),
  q('tsql-col-1'), q('tsql-col-mcq-2'), q('tsql-col-mcq-4'),
  // Query anti-patterns (SARGability, RBAR, SELECT *, implicit conversion)
  q('tsql-anti-mcq-1'), q('tsql-anti-mcq-2'), q('tsql-anti-mcq-3'),
  q('tsql-anti-1'), q('tsql-anti-mcq-4'),

  // ===== PILLAR 8: CLOUD WAREHOUSE SQL =====
  // MPP mental model, storage/compute separation, cost models
  q('tsql-mpp-mcq-1'), q('tsql-mpp-mcq-3'), q('tsql-mpp-mcq-4'),
  q('tsql-mpp-mcq-2'), q('tsql-mpp-mcq-5'),
  // Synapse / Fabric (DISTRIBUTION, CTAS, columnstore, statistics)
  q('tsql-syn-mcq-1'), q('tsql-syn-mcq-3'), q('tsql-syn-cloze-1'),
  q('tsql-syn-mcq-2'), q('tsql-syn-mcq-4'), q('tsql-syn-1'),
  // Snowflake & BigQuery contrast (QUALIFY, micro-partitions, time travel, VARIANT/ARRAY, bytes-scanned)
  q('tsql-other-mcq-1'), q('tsql-other-mcq-3'), q('tsql-other-mcq-5'),
  q('tsql-other-mcq-2'), q('tsql-other-mcq-4'),
];
