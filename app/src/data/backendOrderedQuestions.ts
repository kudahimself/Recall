import { Question } from '../types';
import { dj_admin_questions } from './topic_dj_admin';
import { dj_api_docs_questions } from './topic_dj_api_docs';
import { dj_auth_questions } from './topic_dj_auth';
import { dj_caching_questions } from './topic_dj_caching';
import { dj_celery_questions } from './topic_dj_celery';
import { dj_channels_questions } from './topic_dj_channels';
import { dj_cicd_questions } from './topic_dj_cicd';
import { dj_custom_managers_questions } from './topic_dj_custom_managers';
import { dj_deployment_questions } from './topic_dj_deployment';
import { dj_factory_boy_questions } from './topic_dj_factory_boy';
import { dj_file_uploads_questions } from './topic_dj_file_uploads';
import { dj_forms_questions } from './topic_dj_forms';
import { dj_management_questions } from './topic_dj_management';
import { dj_models_questions } from './topic_dj_models';
import { dj_monitoring_questions } from './topic_dj_monitoring';
import { dj_nginx_questions } from './topic_dj_nginx';
import { dj_orm_questions } from './topic_dj_orm';
import { dj_orm_mastery_questions } from './topic_dj_orm_mastery';
import { dj_models_mastery_questions } from './topic_dj_models_mastery';
import { dj_views_mastery_questions } from './topic_dj_views_mastery';
import { dj_forms_mastery_questions } from './topic_dj_forms_mastery';
import { dj_auth_mastery_questions } from './topic_dj_auth_mastery';
import { dj_rest_mastery_questions } from './topic_dj_rest_mastery';
import { dj_pagination_generics_questions } from './topic_dj_pagination_generics';
import { dj_postgres_questions } from './topic_dj_postgres';
import { dj_redis_questions } from './topic_dj_redis';
import { dj_rest_questions } from './topic_dj_rest';
import { dj_service_layer_questions } from './topic_dj_service_layer';
import { dj_settings_questions } from './topic_dj_settings';
import { dj_setup_questions } from './topic_dj_setup';
import { dj_signals_mw_questions } from './topic_dj_signals_mw';
import { dj_templates_questions } from './topic_dj_templates';
import { dj_transactions_questions } from './topic_dj_transactions';
import { dj_urls_questions } from './topic_dj_urls';
import { dj_views_questions } from './topic_dj_views';
import { dj_cbv_questions } from './topic_dj_cbv';
import { py_async_questions } from './topic_py_async';
import { py_basics_questions } from './topic_py_basics';
import { py_cli_questions } from './topic_py_cli';
import { py_collections_questions } from './topic_py_collections';
import { py_comprehensions_questions } from './topic_py_comprehensions';
import { py_threading_questions } from './topic_py_threading';
import { py_futures_questions } from './topic_py_futures';
import { py_context_managers_questions } from './topic_py_context_managers';
import { py_daily_patterns_questions } from './topic_py_daily_patterns';
import { py_data_structures_questions } from './topic_py_data_structures';
import { py_dataclasses_questions } from './topic_py_dataclasses';
import { py_datetime_paths_questions } from './topic_py_datetime_paths';
import { py_decorators_questions } from './topic_py_decorators';
import { py_error_handling_questions } from './topic_py_error_handling';
import { py_file_io_questions } from './topic_py_file_io';
import { py_functions_questions } from './topic_py_functions';
import { py_generators_questions } from './topic_py_generators';
import { py_functools_questions } from './topic_py_functools';
import { py_http_questions } from './topic_py_http';
import { py_itertools_questions } from './topic_py_itertools';
import { py_logging_questions } from './topic_py_logging';
import { py_magic_methods_questions } from './topic_py_magic_methods';
import { py_modern_questions } from './topic_py_modern';
import { py_modules_questions } from './topic_py_modules';
import { py_oop_questions } from './topic_py_oop';
import { py_oop_advanced_questions } from './topic_py_oop_advanced';
import { py_metaclasses_questions } from './topic_py_metaclasses';
import { py_packaging_questions } from './topic_py_packaging';
import { py_pydantic_questions } from './topic_py_pydantic';
import { py_regex_questions } from './topic_py_regex';
import { py_security_questions } from './topic_py_security';
import { py_serialization_questions } from './topic_py_serialization';
import { py_shell_os_questions } from './topic_py_shell_os';
import { py_testing_basics_questions } from './topic_py_testing_basics';
import { py_fixtures_questions } from './topic_py_fixtures';
import { py_mocking_questions } from './topic_py_mocking';
import { py_type_hints_questions } from './topic_py_type_hints';

const allQuestions: Question[] = [
  ...dj_admin_questions,
  ...dj_api_docs_questions,
  ...dj_auth_questions,
  ...dj_caching_questions,
  ...dj_celery_questions,
  ...dj_channels_questions,
  ...dj_cicd_questions,
  ...dj_custom_managers_questions,
  ...dj_deployment_questions,
  ...dj_factory_boy_questions,
  ...dj_file_uploads_questions,
  ...dj_forms_questions,
  ...dj_management_questions,
  ...dj_models_questions,
  ...dj_monitoring_questions,
  ...dj_nginx_questions,
  ...dj_orm_questions,
  ...dj_orm_mastery_questions,
  ...dj_models_mastery_questions,
  ...dj_views_mastery_questions,
  ...dj_forms_mastery_questions,
  ...dj_auth_mastery_questions,
  ...dj_rest_mastery_questions,
  ...dj_pagination_generics_questions,
  ...dj_postgres_questions,
  ...dj_redis_questions,
  ...dj_rest_questions,
  ...dj_service_layer_questions,
  ...dj_settings_questions,
  ...dj_setup_questions,
  ...dj_signals_mw_questions,
  ...dj_templates_questions,
  ...dj_transactions_questions,
  ...dj_urls_questions,
  ...dj_views_questions,
  ...dj_cbv_questions,
  ...py_async_questions,
  ...py_basics_questions,
  ...py_cli_questions,
  ...py_collections_questions,
  ...py_comprehensions_questions,
  ...py_threading_questions,
  ...py_futures_questions,
  ...py_context_managers_questions,
  ...py_daily_patterns_questions,
  ...py_data_structures_questions,
  ...py_dataclasses_questions,
  ...py_datetime_paths_questions,
  ...py_decorators_questions,
  ...py_error_handling_questions,
  ...py_file_io_questions,
  ...py_functions_questions,
  ...py_generators_questions,
  ...py_functools_questions,
  ...py_http_questions,
  ...py_itertools_questions,
  ...py_logging_questions,
  ...py_magic_methods_questions,
  ...py_modern_questions,
  ...py_modules_questions,
  ...py_oop_questions,
  ...py_oop_advanced_questions,
  ...py_metaclasses_questions,
  ...py_packaging_questions,
  ...py_pydantic_questions,
  ...py_regex_questions,
  ...py_security_questions,
  ...py_serialization_questions,
  ...py_shell_os_questions,
  ...py_testing_basics_questions,
  ...py_fixtures_questions,
  ...py_mocking_questions,
  ...py_type_hints_questions,
];

const qMap = new Map<string, Question>();
for (const question of allQuestions) qMap.set(question.id, question);
function q(id: string): Question {
  const found = qMap.get(id);
  if (!found) throw new Error(`Backend question not found: ${id}`);
  return found;
}

export const backendOrderedQuestions: Question[] = [
  // ===== Topic.PY_BASICS =====
  q('pe1-m1-1'), q('pe1-m1-2'), q('pe1-m1-3'), q('pe1-m2-1'),
  q('pe1-m2-2'), q('pe1-m2-3'), q('pe1-m2-4'), q('pe1-m2-5'),
  q('pe1-m2-8'), q('pe1-m2-9'), q('pe1-m2-10'), q('pe1-m2-12'),
  q('pe1-m2-13'), q('pe1-m2-14'), q('pe1-m2-15'), q('pe1-m3-1'),
  q('pe1-m3-2'), q('pe1-m3-3'), q('pe1-m3-5'), q('pe1-m3-6'),
  q('pe1-m3-8'), q('pe1-m3-10'), q('pe1-m3-11'), q('pe1-m3-12'),
  q('pe1-builtins-1'), q('pe1-builtins-2'), q('pe1-builtins-4'), q('pe1-format-1'),
  q('pe1-idioms-1'), q('pe1-idioms-2'), q('py-basic-1'), q('be-sql-4'),
  q('py-basics-misc-mcq-1'), q('py-basics-misc-mcq-2'), q('py-basics-misc-mcq-3'), q('py-basics-misc-mcq-4'),
  q('py-basics-misc-mcq-5'), q('py-basics-misc-mcq-6'), q('py-basics-misc-mcq-7'), q('py-basics-misc-mcq-8'),
  q('py-basics-misc-mcq-9'), q('py-basics-misc-mcq-10'), q('py-basics-predict-1'), q('py-basics-predict-10'),
  q('py-basics-predict-2'), q('py-basics-predict-3'), q('py-basics-predict-4'), q('py-basics-predict-5'),
  q('py-basics-predict-6'), q('py-basics-predict-7'), q('py-basics-predict-8'), q('py-basics-predict-9'),
  q('py-basics-parsons-1'), q('py-basics-parsons-10'), q('py-basics-parsons-2'), q('py-basics-parsons-3'),
  q('py-basics-parsons-4'), q('py-basics-parsons-5'), q('py-basics-parsons-6'), q('py-basics-parsons-7'),
  q('py-basics-parsons-8'), q('py-basics-parsons-9'), q('py-basics-cloze-1'), q('py-basics-cloze-10'),
  q('py-basics-cloze-2'), q('py-basics-cloze-3'), q('py-basics-cloze-4'), q('py-basics-cloze-5'),
  q('py-basics-cloze-6'), q('py-basics-cloze-7'), q('py-basics-cloze-8'), q('py-basics-cloze-9'),
  q('pe1-m1-4'), q('pe1-m2-6'), q('pe1-m2-7'), q('pe1-m2-11'),
  q('pe1-m2-16'), q('pe1-m3-4'), q('pe1-m3-7'), q('pe1-m3-9'),
  q('pe1-m3-13'), q('pe1-m3-14'), q('pe1-builtins-3'), q('pe1-builtins-5'),
  q('pe1-format-2'), q('pe1-idioms-3'), q('pe1-idioms-4'), q('py-basic-2'),
  q('py-basic-3'), q('py-basic-4'), q('be-sql-1'), q('be-sql-3'),
  q('be-sql-2'),

  // ===== Topic.PY_DATA_STRUCTURES =====
  q('pe1-m3-15'), q('pe1-m3-16'), q('pe1-m3-17'), q('pe1-m3-19'),
  q('pe1-m3-21'), q('pe1-m3-23'), q('pe1-m4-6'), q('pe1-m4-7'),
  q('pe1-m4-9'), q('pe1-m4-10'), q('py-data-structures-predict-10'), q('py-data-structures-predict-2'),
  q('py-data-structures-predict-3'), q('py-data-structures-predict-4'), q('py-data-structures-predict-5'), q('py-data-structures-predict-6'),
  q('py-data-structures-predict-7'), q('py-data-structures-parsons-1'), q('py-data-structures-parsons-10'), q('py-data-structures-parsons-2'),
  q('py-data-structures-parsons-3'), q('py-data-structures-parsons-4'), q('py-data-structures-parsons-6'), q('py-data-structures-parsons-7'),
  q('py-data-structures-cloze-1'), q('py-data-structures-cloze-10'), q('py-data-structures-cloze-2'), q('py-data-structures-cloze-3'),
  q('py-data-structures-cloze-4'), q('py-data-structures-cloze-5'), q('py-data-structures-cloze-6'), q('py-data-structures-cloze-8'),
  q('py-data-structures-cloze-9'), q('pe1-m3-18'), q('pe1-m3-20'), q('pe1-m3-22'),
  q('pe1-m3-24'), q('pe1-m4-8'), q('pe1-m4-11'), q('pe1-m4-12'),
  q('py-ds-1'), q('py-data-structures-predict-1'), q('py-ds-2'), q('py-ds-3'),
  q('py-ds-4'), q('py-data-structures-predict-8'), q('py-data-structures-predict-9'), q('py-data-structures-parsons-5'),
  q('py-data-structures-parsons-8'), q('py-data-structures-parsons-9'), q('py-data-structures-cloze-7'),

  // ===== Topic.PY_FUNCTIONS =====
  q('pe1-m4-1'), q('pe1-m4-2'), q('pe1-m4-3'), q('pe1-m4-5'),
  q('pe1-closure-1'), q('py-gap-functions-1'), q('py-functions-predict-3'), q('py-functions-predict-8'),
  q('py-functions-parsons-1'), q('py-functions-parsons-2'), q('py-functions-parsons-4'), q('py-functions-parsons-6'),
  q('py-functions-cloze-1'), q('py-functions-cloze-3'), q('py-functions-cloze-4'), q('py-functions-cloze-5'),
  q('py-functions-cloze-6'), q('py-functions-cloze-7'), q('py-functions-cloze-8'), q('pe1-m4-4'),
  q('pe1-closure-2'), q('py-gap-functions-2'), q('pcpp-args-1'), q('pcpp-args-3'),
  q('py-functions-predict-1'), q('py-functions-predict-10'), q('py-functions-predict-4'), q('py-functions-predict-6'),
  q('py-functions-predict-7'), q('py-functions-predict-9'), q('py-functions-parsons-10'), q('py-functions-parsons-8'),
  q('py-functions-cloze-2'), q('py-fn-1'), q('py-fn-2'), q('py-fn-3'),
  q('pcpp-args-2'), q('py-functions-predict-2'), q('py-functions-predict-5'), q('py-functions-parsons-3'),
  q('py-functions-parsons-5'), q('py-functions-parsons-7'), q('py-functions-parsons-9'), q('py-functions-cloze-10'),
  q('py-functions-cloze-9'),

  // ===== Topic.PY_MODULES =====
  q('pe1-modules-1'), q('py-modules-predict-10'), q('py-modules-predict-2'), q('py-modules-predict-3'),
  q('py-modules-predict-6'), q('py-modules-predict-9'), q('py-modules-parsons-1'), q('py-modules-parsons-2'),
  q('py-modules-parsons-3'), q('py-modules-parsons-7'), q('py-modules-parsons-9'), q('py-modules-cloze-10'),
  q('py-modules-cloze-2'), q('py-modules-cloze-3'), q('py-modules-cloze-7'), q('py-modules-cloze-8'),
  q('py-modules-cloze-9'), q('pe1-modules-2'), q('pe1-modules-3'), q('pcpp-pickle-1'),
  q('pcpp-pickle-3'), q('pcpp-shelve-1'), q('py-modules-predict-1'), q('py-modules-predict-5'),
  q('py-modules-predict-7'), q('py-modules-parsons-6'), q('py-modules-parsons-8'), q('py-modules-cloze-1'),
  q('py-modules-cloze-6'), q('pcpp-pickle-2'), q('pcpp-shelve-2'), q('py-modules-predict-4'),
  q('py-modules-predict-8'), q('py-modules-parsons-10'), q('py-modules-parsons-4'), q('py-modules-parsons-5'),
  q('py-modules-cloze-4'), q('py-modules-cloze-5'),

  // ===== Topic.PY_FILE_IO =====
  q('pe1-fileio-1'), q('pe1-fileio-2'), q('py-file-io-predict-1'), q('py-file-io-predict-2'),
  q('py-file-io-predict-3'), q('pe1-fileio-3'), q('py-io-1'), q('py-io-2'),
  q('py-io-6'), q('py-file-io-predict-6'), q('py-io-3'), q('py-io-4'),
  q('py-io-5'), q('py-file-io-predict-4'), q('py-file-io-predict-5'), q('py-file-io-predict-7'),

  // ===== Topic.PY_OOP =====
  q('py-oop-beg-1'), q('py-oop-beg-2'), q('pcpp-oop-1'), q('py-dec-beg-2'),
  q('py-oop-cloze-1'), q('py-oop-cloze-2'), q('py-oop-cloze-3'), q('py-oop-cloze-4'),
  q('py-oop-cloze-7'), q('py-oop-cloze-8'), q('py-oop-beg-3'), q('pcpp-oop-2'),
  q('py-gap-oop-2'), q('pcpp-oop-3'), q('pcpp-inherit-3'), q('pcpp-methods-1'),
  q('py-dec-2'), q('py-oop-predict-1'), q('py-oop-predict-3'), q('py-oop-predict-4'),
  q('py-oop-predict-5'), q('py-oop-predict-6'), q('py-oop-predict-7'), q('py-oop-predict-10'),
  q('py-oop-parsons-1'), q('py-oop-parsons-2'), q('py-oop-parsons-3'), q('py-oop-parsons-5'),
  q('py-oop-parsons-8'), q('py-oop-parsons-9'), q('py-oop-cloze-10'), q('py-oop-1'),
  q('py-oop-2'), q('pcpp-inherit-2'), q('pcpp-inherit-4'), q('pcpp-methods-2'),

  // ===== Topic.PY_ERROR_HANDLING =====
  q('py-err-beg-1'), q('py-err-beg-2'), q('py-err-beg-3'), q('py-err-beg-4'),
  q('py-error-handling-predict-9'), q('py-error-handling-parsons-1'), q('py-error-handling-parsons-5'), q('py-error-handling-parsons-6'),
  q('py-error-handling-parsons-8'), q('py-error-handling-cloze-10'), q('py-error-handling-cloze-2'), q('py-error-handling-cloze-3'),
  q('py-error-handling-cloze-4'), q('py-error-handling-cloze-5'), q('py-error-handling-cloze-7'), q('py-err-beg-5'),
  q('py-err-5'), q('pcpp-exc-1'), q('pcpp-exc-3'), q('py-error-handling-predict-1'),
  q('py-error-handling-predict-2'), q('py-error-handling-predict-4'), q('py-error-handling-predict-5'), q('py-error-handling-predict-6'),
  q('py-error-handling-predict-7'), q('py-error-handling-predict-10'), q('py-error-handling-parsons-2'), q('py-error-handling-parsons-3'),
  q('py-error-handling-parsons-4'), q('py-error-handling-cloze-1'), q('py-error-handling-cloze-8'), q('py-error-handling-cloze-6'),
  q('py-err-1'), q('py-err-2'), q('py-err-3'), q('py-err-4'),
  q('py-err-6'), q('pcpp-exc-2'), q('pcpp-exc-4'), q('py-error-handling-predict-3'),
  q('py-error-handling-predict-8'), q('py-error-handling-parsons-10'), q('py-error-handling-parsons-7'), q('py-error-handling-parsons-9'),
  q('py-error-handling-cloze-9'),

  // ===== Topic.PY_DECORATORS =====
  q('py-dec-beg-1'), q('py-dec-beg-3'), q('py-gap-decorators-1'), q('py-decorators-parsons-5'),
  q('py-decorators-parsons-1'), q('py-decorators-cloze-2'), q('py-decorators-cloze-5'), q('py-decorators-cloze-6'),
  q('py-gap-decorators-2'), q('pcpp-dec-1'), q('py-decorators-predict-1'), q('py-decorators-predict-2'),
  q('py-decorators-predict-3'), q('py-decorators-predict-4'), q('py-decorators-predict-7'), q('py-decorators-predict-8'),
  q('py-decorators-predict-9'), q('py-decorators-parsons-10'), q('py-decorators-parsons-2'), q('py-decorators-parsons-6'),
  q('py-decorators-parsons-8'), q('py-decorators-parsons-4'), q('py-decorators-cloze-1'), q('py-decorators-cloze-10'),
  q('py-decorators-cloze-3'), q('py-decorators-cloze-9'), q('pcpp-dec-2'), q('pcpp-dec-3'),
  q('py-decorators-predict-10'), q('py-decorators-predict-5'), q('py-decorators-predict-6'), q('py-decorators-parsons-3'),
  q('py-decorators-parsons-7'), q('py-decorators-parsons-9'), q('py-decorators-cloze-4'), q('py-decorators-cloze-7'),
  q('py-decorators-cloze-8'), q('py-dec-1'), q('py-dec-3'), q('py-dec-4'),

  // ===== Topic.PY_TYPE_HINTS =====
  q('py-types-union-1'), q('py-gap-typehints-1'), q('py-type-hints-cloze-1'), q('py-type-hints-cloze-10'),
  q('py-type-hints-cloze-2'), q('py-type-hints-cloze-3'), q('py-type-hints-cloze-4'), q('py-type-hints-cloze-6'),
  q('py-type-hints-cloze-8'), q('py-gap-typehints-2'), q('py-adv-types-1'), q('py-adv-types-2'),
  q('py-adv-types-3'), q('py-types-protocol-1'), q('py-types-typeddict-1'), q('py-types-literal-1'),
  q('py-types-final-overload-1'), q('py-types-typeguard-1'), q('py-types-callable'), q('py-types-generic-class'),
  q('py-types-runtime'), q('py-types-paramspec'), q('py-type-hints-cloze-5'), q('py-type-hints-cloze-7'),
  q('py-type-hints-cloze-9'),

  // ===== Topic.PY_DATACLASSES =====
  q('py-dc-what'), q('py-gap-dataclasses-1'), q('py-dataclasses-parsons-6'), q('py-dataclasses-cloze-1'),
  q('py-dataclasses-cloze-10'), q('py-dataclasses-cloze-2'), q('py-dataclasses-cloze-3'), q('py-dataclasses-cloze-6'),
  q('py-dc-simple'), q('py-dataclasses-cloze-4'), q('py-dc-field-factory'), q('py-dc-frozen-basic'),
  q('py-dataclasses-cloze-5'), q('py-dc-post-init-basic'), q('py-dc-repr-false'), q('py-dc-order-sortable'),
  q('py-dataclasses-slots-cloze-1'), q('py-dc-slots'), q('py-dc-asdict'), q('py-dataclasses-inheritance-cloze-1'),
  q('py-dc-inheritance'), q('py-gap-dataclasses-2'), q('py-dc-vs-others'), q('py-adv-dc-3'),
  q('py-dataclasses-predict-1'), q('py-dataclasses-predict-2'), q('py-dataclasses-predict-3'), q('py-dataclasses-predict-6'),
  q('py-dataclasses-predict-7'), q('py-dataclasses-predict-9'), q('py-dataclasses-parsons-1'), q('py-dataclasses-parsons-2'),
  q('py-dataclasses-parsons-3'), q('py-dataclasses-parsons-8'), q('py-dataclasses-parsons-9'),
  q('py-dataclasses-cloze-7'), q('py-dc-init-false'), q('py-dc-frozen-order'), q('py-dataclasses-predict-10'),
  q('py-dataclasses-predict-4'), q('py-dataclasses-predict-5'), q('py-dataclasses-predict-8'), q('py-dataclasses-parsons-10'),
  q('py-dataclasses-parsons-4'), q('py-dataclasses-parsons-5'), q('py-dataclasses-parsons-7'),
  q('py-dataclasses-cloze-8'), q('py-dataclasses-cloze-9'),

  // ===== Topic.PY_COMPREHENSIONS =====
  q('py-comp-what-is'), q('py-gap-comprehensions-1'), q('py-comprehensions-predict-1'), q('py-comprehensions-predict-10'),
  q('py-comprehensions-predict-2'), q('py-comprehensions-predict-3'), q('py-comprehensions-predict-4'), q('py-comprehensions-predict-8'),
  q('py-comprehensions-predict-9'), q('py-comprehensions-parsons-1'), q('py-comprehensions-parsons-10'), q('py-comprehensions-parsons-2'),
  q('py-comprehensions-parsons-3'), q('py-comprehensions-parsons-5'), q('py-comprehensions-parsons-6'), q('py-comprehensions-parsons-7'),
  q('py-comprehensions-parsons-4'), q('py-comprehensions-cloze-5'), q('py-comprehensions-cloze-9'), q('py-comprehensions-cloze-6'),
  q('py-comp-squared-evens'), q('py-comp-dict-doubled'), q('py-comp-set-unique-words'), q('py-comp-nested-matrix'),
  q('py-comp-flatten'), q('py-comp-ternary'), q('py-comp-genexp-sum'), q('py-comp-invert-dict'),
  q('py-gap-comprehensions-2'), q('py-comp-genexp-vs-list'), q('py-adv-comp-3'), q('py-comprehensions-cloze-1'),
  q('py-comprehensions-cloze-2'), q('py-comprehensions-cloze-3'), q('py-comprehensions-cloze-4'), q('py-comprehensions-cloze-8'),
  q('py-comp-int-dict-filter'), q('py-comprehensions-predict-5'), q('py-comprehensions-predict-6'), q('py-comprehensions-predict-7'),
  q('py-comprehensions-parsons-8'), q('py-comprehensions-parsons-9'), q('py-comprehensions-cloze-10'), q('py-comprehensions-cloze-7'),
  q('py-adv-comp-1'), q('py-adv-comp-2'),

  // ===== Topic.PY_GENERATORS =====
  q('pe1-gen-1'), q('py-gen-memory-mcq'), q('py-gen-predict-lazy'), q('py-gen-predict-stopiteration'),
  q('py-gen-parsons-1'), q('py-gen-cloze-1'), q('pe1-gen-2'), q('py-gen-predict-state'),
  q('py-gen-predict-exhaust'), q('py-gen-predict-return'), q('py-gen-pipeline'), q('py-gen-infinite-islice'),
  q('py-gen-yield-from-predict'), q('py-gen-send-predict'), q('py-gen-yield-from'), q('py-gen-send-coroutine'),

  // ===== Topic.PY_COLLECTIONS =====
  q('py-coll-types-overview'), q('py-collections-predict-10'), q('py-collections-predict-2'), q('py-collections-predict-4'),
  q('py-collections-predict-6'), q('py-collections-predict-8'), q('py-collections-predict-9'), q('py-collections-predict-3'),
  q('py-collections-parsons-1'), q('py-collections-parsons-2'), q('py-collections-parsons-6'), q('py-collections-parsons-8'),
  q('py-collections-parsons-9'), q('py-collections-parsons-4'), q('py-collections-cloze-1'), q('py-collections-cloze-10'),
  q('py-collections-cloze-2'), q('py-collections-cloze-3'), q('py-collections-cloze-4'), q('py-collections-cloze-5'),
  q('py-collections-cloze-8'), q('py-collections-cloze-9'), q('py-collections-cloze-6'), q('py-coll-counter-arithmetic'),
  q('py-coll-defaultdict-group'), q('py-coll-namedtuple'), q('py-coll-chainmap'), q('py-coll-deque-queue'),
  q('py-coll-deque-maxlen'), q('py-coll-deque-rotate'), q('py-coll-ordered-vs-dict'), q('py-adv-coll-3'),
  q('py-collections-predict-1'), q('py-collections-parsons-3'), q('py-coll-int-deque-counter'), q('py-adv-coll-2'),
  q('py-collections-predict-5'), q('py-collections-predict-7'), q('py-collections-parsons-10'), q('py-collections-parsons-5'),
  q('py-collections-parsons-7'), q('py-collections-cloze-7'), q('py-adv-coll-1'),

  // ===== Topic.PY_ITERTOOLS =====
  q('py-iter-what'), q('py-itertools-predict-1'), q('py-itertools-predict-3'), q('py-itertools-predict-4'),
  q('py-itertools-predict-6'), q('py-itertools-predict-7'), q('py-itertools-predict-8'), q('py-itertools-parsons-1'),
  q('py-itertools-parsons-3'), q('py-itertools-parsons-4'), q('py-itertools-parsons-7'), q('py-itertools-parsons-10'),
  q('py-itertools-cloze-1'), q('py-itertools-cloze-2'), q('py-itertools-cloze-3'), q('py-itertools-cloze-4'),
  q('py-itertools-cloze-5'), q('py-itertools-cloze-7'), q('py-itertools-cloze-8'), q('py-itertools-cloze-10'),
  q('py-iter-groupby'), q('py-iter-takewhile-dropwhile'), q('py-itertools-starmap-cloze-1'), q('py-iter-starmap'),
  q('py-itertools-pairwise-cloze-1'), q('py-iter-pairwise'),
  q('py-adv-iter-3'), q('py-itertools-predict-9'), q('py-itertools-parsons-6'), q('py-itertools-parsons-9'),
  q('py-itertools-cloze-6'), q('py-itertools-cloze-9'), q('py-iter-int-product-islice'), q('py-adv-iter-2'),
  q('py-itertools-predict-2'), q('py-itertools-predict-5'), q('py-itertools-predict-10'), q('py-itertools-parsons-2'),
  q('py-itertools-parsons-5'), q('py-itertools-parsons-8'), q('py-adv-iter-1'),

  // ===== Topic.PY_FUNCTOOLS =====
  q('py-functools-1'), q('py-functools-predict-1'), q('py-functools-predict-10'), q('py-functools-predict-8'),
  q('py-functools-predict-6'), q('py-functools-parsons-3'), q('py-functools-parsons-8'), q('py-functools-parsons-6'),
  q('py-functools-cloze-1'), q('py-functools-cloze-2'), q('py-functools-cloze-3'), q('py-functools-cloze-4'),
  q('py-functools-cloze-5'), q('py-functools-cloze-9'), q('py-functools-cloze-7'), q('py-functools-2'),
  q('py-functools-3'), q('py-functools-4'), q('py-functools-5'), q('py-functools-6'),
  q('py-functools-predict-2'), q('py-functools-predict-3'), q('py-functools-predict-4'), q('py-functools-predict-7'),
  q('py-functools-parsons-1'), q('py-functools-parsons-2'), q('py-functools-parsons-4'), q('py-functools-parsons-9'),
  q('py-functools-predict-5'), q('py-functools-predict-9'), q('py-functools-parsons-10'), q('py-functools-parsons-5'),
  q('py-functools-parsons-7'), q('py-functools-cloze-10'), q('py-functools-cloze-6'), q('py-functools-cloze-8'),

  // ===== Topic.PY_CONTEXT_MANAGERS =====
  q('py-ctx-what'), q('py-gap-contextmgr-1'), q('py-ctx-exitstack-parsons'), q('py-context-managers-parsons-6'),
  q('py-context-managers-parsons-7'), q('py-context-managers-parsons-2'), q('py-context-managers-cloze-3'), q('py-context-managers-cloze-4'),
  q('py-context-managers-cloze-6'), q('py-context-managers-cloze-8'), q('py-context-managers-cloze-1'), q('py-ctx-file'),
  q('py-context-managers-cloze-2'), q('py-ctx-custom-class'), q('py-ctx-contextmanager-decorator'), q('py-ctx-multiple'),
  q('py-ctx-suppress'), q('py-ctx-exitstack'), q('py-context-managers-cloze-7'), q('py-ctx-exit-suppress-exc'),
  q('py-gap-contextmgr-2'), q('py-ctx-exitstack-vs-comma'),
  q('py-ctx-vs-try-finally'), q('py-adv-ctx-3'), q('py-context-managers-predict-1'), q('py-context-managers-predict-2'),
  q('py-context-managers-predict-3'), q('py-context-managers-predict-7'), q('py-context-managers-predict-8'), q('py-context-managers-predict-9'),
  q('py-context-managers-parsons-1'), q('py-context-managers-parsons-10'), q('py-context-managers-parsons-4'),
  q('py-context-managers-cloze-9'), q('py-context-managers-exceptcatch-cloze-1'), q('py-ctx-reentrant'), q('py-context-managers-predict-10'), q('py-context-managers-predict-4'),
  q('py-context-managers-predict-5'), q('py-context-managers-predict-6'), q('py-context-managers-parsons-3'), q('py-context-managers-parsons-5'),
  q('py-context-managers-parsons-8'), q('py-context-managers-parsons-9'), q('py-context-managers-cloze-10'), q('py-context-managers-cloze-5'),
  q('py-adv-ctx-1'),

  // ===== Topic.PY_MAGIC_METHODS =====
  q('py-gap-magic-1'), q('py-magic-methods-parsons-10'), q('py-magic-methods-parsons-6'), q('py-magic-methods-cloze-1'),
  q('py-magic-methods-cloze-10'), q('py-magic-methods-cloze-4'), q('py-magic-methods-cloze-5'), q('py-magic-methods-cloze-7'),
  q('py-magic-methods-cloze-8'), q('py-magic-methods-cloze-2'), q('py-magic-str-vs-repr'), q('py-magic-methods-cloze-3'),
  q('py-magic-eq-hash'), q('py-magic-container-protocol'),
  q('py-magic-methods-iternext-cloze-1'), q('py-magic-iter'), q('py-magic-methods-addiadd-cloze-1'), q('py-magic-add-iadd'), q('py-magic-call'), q('py-gap-magic-2'),
  q('py-adv-magic-3'), q('py-magic-hash-mutable'), q('py-magic-aenter-vs-enter'), q('pcpp-magic-1'),
  q('py-magic-methods-predict-1'), q('py-magic-methods-predict-2'), q('py-magic-notimplemented-cloze-1'),
  q('py-magic-methods-predict-3'), q('py-magic-methods-predict-4'),
  q('py-magic-methods-predict-7'), q('py-magic-methods-predict-8'), q('py-magic-methods-predict-9'), q('py-magic-methods-parsons-1'),
  q('py-magic-methods-parsons-2'), q('py-magic-methods-parsons-3'), q('py-magic-methods-parsons-8'), q('py-magic-methods-parsons-5'),
  q('py-magic-methods-cloze-9'), q('pcpp-magic-2'),
  q('pcpp-magic-3a'), q('pcpp-magic-3b'), q('py-magic-methods-predict-10'), q('py-magic-methods-predict-5'),
  q('py-magic-methods-predict-6'), q('py-magic-methods-parsons-4'), q('py-magic-methods-parsons-7'), q('py-magic-methods-parsons-9'),
  q('py-magic-methods-cloze-6'), q('py-adv-magic-1'), q('py-adv-money-add'), q('py-adv-magic-2'),

  // ===== Topic.PY_HTTP =====
  q('py-http-1'), q('py-http-parsons-1'), q('py-http-parsons-2'), q('py-http-parsons-3'),
  q('py-http-parsons-4'), q('py-http-cloze-1'), q('py-http-cloze-2'), q('py-http-cloze-3'),
  q('py-http-cloze-4'), q('py-http-cloze-5'), q('py-http-2'), q('py-http-3'),
  q('py-http-4'), q('py-http-7'), q('py-http-statuscode-cloze-1'), q('py-http-8'), q('py-http-9'),
  q('py-http-10'), q('py-http-12'), q('py-http-6'), q('py-http-14'),
  q('py-http-15'), q('py-http-retry-mcq-1'), q('py-http-retry-cloze-2'), q('py-http-retry-cloze-3'),
  q('py-http-retry-cloze-1'), q('py-http-5'), q('py-http-13'), q('py-http-16'),

  // ===== Topic.PY_ASYNC =====
  q('py-gap-async-1'), q('py-gap-async-2'), q('py-async-predict-1'), q('py-async-predict-7'),
  q('py-async-parsons-3'), q('py-async-parsons-6'), q('py-async-httpx-parsons-1'), q('py-async-cloze-2'),
  q('py-async-cloze-3'), q('py-async-cloze-4'), q('py-async-cloze-5'), q('py-async-cloze-6'),
  q('py-async-cloze-8'), q('py-async-cloze-9'), q('py-async-cloze-10'), q('py-async-httpx-cloze-1'),
  q('py-async-beg-1'), q('py-async-beg-2'), q('py-async-httpx-1'), q('py-async-mcq-taskgroup-vs-gather'),
  q('py-async-mcq-event-loop'), q('py-async-predict-2'), q('py-async-predict-3'), q('py-async-predict-4'),
  q('py-async-parsons-1'), q('py-async-parsons-2'), q('py-async-parsons-4'), q('py-async-parsons-5'),
  q('py-async-parsons-7'), q('py-async-parsons-8'), q('py-async-parsons-10'), q('py-async-parsons-11'),
  q('py-async-cloze-1'), q('py-async-cloze-11'), q('py-gap-async-3'), q('py-adv-async-bridge-1'),
  q('py-adv-async-bridge-3'), q('py-async-int-gen-1'), q('py-async-int-asyncwith'), q('py-async-int-waitfor'),
  q('py-adv-async-bridge-2'), q('py-async-int-gather-errors'), q('py-async-int-queue-1'), q('py-async-int-semaphore'),
  q('py-async-int-waitfor-gather'), q('py-async-int-asyncgen-queue'), q('py-async-parsons-9'), q('py-async-cloze-7'), q('py-adv-async-3'), q('py-adv-async-4'),
  q('py-adv-async-5'), q('py-async-predict-5'), q('py-async-predict-6'), q('py-async-predict-8'),
  q('py-async-predict-9'), q('py-async-predict-10'),
  q('py-async-adv-tothread'), q('py-async-adv-taskgroup'), q('py-adv-async-1'), q('py-adv-async-2'),
  q('py-async-adv-rate-limited-fetcher'),

  // ===== Topic.PY_THREADING =====
  q('py-thread-beg-what'), q('py-thread-beg-gil'), q('py-thread-beg-race'), q('py-concurrency-1'),
  q('py-concurrency-parsons-1'), q('py-concurrency-cloze-1'), q('py-concurrency-cloze-5'), q('py-concurrency-4'),
  q('py-concurrency-5'), q('py-concurrency-predict-3'), q('py-concurrency-predict-5'), q('py-concurrency-predict-9'),
  q('py-concurrency-parsons-2'), q('py-concurrency-parsons-8'), q('py-concurrency-cloze-2'), q('py-concurrency-predict-10'),
  q('py-concurrency-predict-4'), q('py-concurrency-predict-6'), q('py-concurrency-predict-8'), q('py-concurrency-parsons-4'),
  q('py-concurrency-parsons-5'), q('py-concurrency-parsons-9'), q('py-concurrency-cloze-6'), q('py-concurrency-cloze-7'),
  q('py-concurrency-cloze-9'), q('py-concurrency-cloze-10'),

  // ===== Topic.PY_FUTURES =====
  q('py-fut-beg-executor'), q('py-fut-beg-future'), q('py-fut-beg-which'), q('py-fut-beg-executor'),
  q('py-fut-beg-future'), q('py-fut-beg-which'), q('py-concurrency-parsons-3'), q('py-concurrency-cloze-3'),
  q('py-fut-int-submit-map'), q('py-concurrency-6'), q('py-concurrency-6'), q('py-fut-int-submit-map'),
  q('py-concurrency-predict-1'), q('py-concurrency-predict-7'), q('py-concurrency-2'), q('py-concurrency-2'),
  q('py-concurrency-predict-2'), q('py-concurrency-parsons-6'), q('py-concurrency-parsons-7'), q('py-concurrency-parsons-10'),
  q('py-concurrency-cloze-4'), q('py-concurrency-cloze-8'), q('py-concurrency-3'), q('py-concurrency-3'),

  // ===== Topic.PY_REGEX =====
  q('py-regex-match-vs-search'), q('py-regex-lookaround'), q('py-regex-api-match'), q('py-regex-api-search'),
  q('py-regex-api-findall'), q('py-regex-api-fullmatch'), q('py-regex-api-finditer'), q('py-regex-api-sub'),
  q('py-regex-api-split'), q('py-regex-api-compile'), q('py-regex-api-no-match'), q('py-regex-api-group-zero'),
  q('py-regex-predict-1'), q('py-regex-predict-10'), q('py-regex-predict-3'), q('py-regex-predict-7'),
  q('py-regex-predict-8'), q('py-regex-parsons-1'), q('py-regex-parsons-2'), q('py-regex-parsons-3'),
  q('py-regex-parsons-4'), q('py-regex-parsons-5'), q('py-regex-parsons-8'), q('py-regex-cloze-1'),
  q('py-regex-cloze-10'), q('py-regex-cloze-2'), q('py-regex-cloze-3'), q('py-regex-cloze-6'),
  q('py-regex-cloze-8'), q('py-regex-cloze-9'), q('py-regex-cloze-5'), q('py-regex-prim-D'),
  q('py-regex-prim-w'), q('py-regex-prim-W'), q('py-regex-prim-s'), q('py-regex-prim-S'),
  q('py-regex-prim-dot'), q('py-regex-prim-set'), q('py-regex-prim-charclass'), q('py-regex-prim-combined'),
  q('py-regex-prim-neg-charclass'), q('py-regex-prim-star'), q('py-regex-prim-plus'), q('py-regex-prim-optional'),
  q('py-regex-prim-brace-exact'), q('py-regex-prim-brace-min'), q('py-regex-prim-brace-range'), q('py-regex-prim-caret'),
  q('py-regex-prim-dollar'), q('py-regex-prim-word-boundary'), q('py-regex-prim-compose-digits'), q('py-regex-prim-compose-year'),
  q('py-regex-prim-compose-optional'), q('py-regex-prim-capture'), q('py-regex-prim-escape-dot'), q('py-regex-prim-escape-paren'),
  q('py-regex-prim-alternation'), q('py-regex-fullmatch-cloze-1'), q('py-regex-fullmatch-email'), q('py-regex-sub-redact'), q('py-regex-split'),
  q('py-regex-finditer'), q('py-regex-named-groups'), q('py-regex-backreference'), q('py-regex-compile-flags'),
  q('py-gap-regex-2'), q('py-regex-greedy-vs-lazy'), q('py-regex-api-findall-tuples'), q('py-regex-api-groupdict'),
  q('py-regex-predict-2'), q('py-regex-predict-9'), q('py-regex-prim-nonboundary'), q('py-regex-prim-noncapture'),
  q('py-regex-prim-backref'), q('py-regex-prim-compose-startword'), q('py-regex-prim-compose-capword'), q('py-regex-prim-compose-wholeword'),
  q('py-regex-prim-compose-decimal'), q('py-regex-parse-keyvalue'), q('py-regex-predict-4'), q('py-regex-predict-5'),
  q('py-regex-predict-6'), q('py-regex-parsons-10'), q('py-regex-parsons-6'), q('py-regex-parsons-7'),
  q('py-regex-parsons-9'), q('py-regex-cloze-4'), q('py-regex-cloze-7'), q('py-regex-prim-compose-tag'),
  q('py-regex-prim-lookahead'), q('py-regex-prim-neg-lookahead'), q('py-regex-prim-lookbehind'), q('py-regex-prim-neg-lookbehind'),
  q('py-adv-regex-1'),

  // ===== Topic.PY_DATETIME_PATHS =====
  q('py-datetime-1'), q('py-datetime-paths-predict-2'), q('py-datetime-paths-predict-6'), q('py-datetime-paths-parsons-1'),
  q('py-datetime-paths-parsons-2'), q('py-datetime-paths-parsons-3'), q('py-datetime-paths-cloze-1'), q('py-datetime-paths-cloze-2'),
  q('py-datetime-paths-cloze-3'), q('py-datetime-2'), q('py-datetime-strftime'), q('py-datetime-4'),
  q('py-datetime-paths-predict-5'), q('py-paths-1'), q('py-paths-2'), q('py-datetime-paths-predict-1'), q('py-datetime-paths-predict-3'),
  q('py-datetime-paths-predict-7'), q('py-datetime-3'), q('py-datetime-paths-predict-4'),
  q('py-datetime-paths-predict-8'),

  // ===== Topic.PY_SERIALIZATION =====
  q('py-json-1'), q('py-serialization-predict-1'), q('py-serialization-predict-4'), q('py-serialization-predict-5'),
  q('py-serialization-predict-7'), q('py-serialization-predict-8'), q('py-serialization-parsons-1'), q('py-serialization-parsons-2'),
  q('py-serialization-parsons-3'), q('py-serialization-cloze-1'), q('py-serialization-cloze-2'), q('py-serialization-cloze-4'),
  q('py-serialization-cloze-5'), q('py-serialization-cloze-8'), q('py-serialization-cloze-7'), q('py-json-2'),
  q('py-ser-json-dump-file'), q('py-json-3'), q('py-serialization-objecthook-cloze-1'), q('py-ser-object-hook'), q('py-ser-pickle'),
  q('py-ser-pickle-vs-json-mcq'), q('py-serialization-predict-2'), q('py-serialization-predict-3'), q('py-serialization-cloze-3'),
  q('py-serialization-jsonencoder-cloze-1'), q('py-json-4'), q('py-ser-dataclass-json'), q('py-serialization-predict-6'), q('py-serialization-cloze-6'),

  // ===== Topic.PY_PYDANTIC =====
  q('py-pydantic-1'), q('py-pydantic-predict-11'), q('py-pydantic-predict-12'), q('py-pydantic-parsons-11'),
  q('py-pydantic-parsons-8'), q('py-pydantic-cloze-1'), q('py-pydantic-cloze-6'), q('py-pydantic-cloze-8'),
  q('py-pydantic-2'), q('py-pydantic-3'), q('py-pydantic-nested-cloze-1'), q('py-pydantic-6'), q('py-pydantic-predict-1'),
  q('py-pydantic-predict-2'), q('py-pydantic-predict-3'), q('py-pydantic-predict-5'), q('py-pydantic-predict-8'),
  q('py-pydantic-predict-9'), q('py-pydantic-predict-6'), q('py-pydantic-parsons-1'), q('py-pydantic-parsons-10'),
  q('py-pydantic-parsons-2'), q('py-pydantic-parsons-5'), q('py-pydantic-parsons-6'), q('py-pydantic-parsons-3'),
  q('py-pydantic-cloze-10'), q('py-pydantic-cloze-2'), q('py-pydantic-cloze-3'), q('py-pydantic-cloze-5'),
  q('py-pydantic-5'), q('py-pydantic-4'), q('py-pydantic-predict-10'), q('py-pydantic-predict-4'),
  q('py-pydantic-predict-7'), q('py-pydantic-parsons-4'), q('py-pydantic-parsons-7'), q('py-pydantic-parsons-9'),
  q('py-pydantic-cloze-4'), q('py-pydantic-cloze-7'), q('py-pydantic-cloze-9'),

  // ===== Topic.PY_LOGGING =====
  q('py-logging-1'), q('py-logging-predict-1'), q('py-logging-predict-2'), q('py-logging-parsons-1'),
  q('py-logging-parsons-2'), q('py-logging-parsons-3'), q('py-logging-cloze-3'), q('py-logging-cloze-5'),
  q('py-logging-cloze-9'), q('py-logging-2'), q('py-logging-3'), q('py-logging-4'),
  q('py-logging-5'), q('py-logging-6'), q('py-logging-predict-3'), q('py-logging-cloze-1'),
  q('py-logging-cloze-2'), q('py-logging-cloze-10'), q('py-logging-cloze-4'), q('py-logging-cloze-6'),
  q('py-logging-cloze-7'), q('py-logging-cloze-8'),

  // ===== Topic.PY_TESTING_BASICS =====
  q('py-gap-testing-1'), q('py-ptest-discovery-1'), q('py-testing-predict-3'), q('py-testing-parsons-1'),
  q('py-testing-parsons-2'), q('py-testing-parsons-6'), q('py-testing-cloze-1'), q('py-testing-cloze-2'),
  q('py-gap-testing-2'), q('py-test-unittest-vs-pytest'), q('be-test-1'), q('py-gap-testing-3'),
  q('py-test-parametrize-ids'), q('py-testing-skipmarker-cloze-1'), q('py-ptest-markers-1'), q('py-ptest-selection-1'), q('py-testing-parsons-3'),
  q('py-ptest-xfail-1'),

  // ===== Topic.PY_FIXTURES =====
  q('py-fix-whatis-1'), q('py-fix-predict-1'), q('py-testing-parsons-4'), q('py-fix-cloze-1'),
  q('py-fix-simple-1'), q('py-testing-parsons-7'), q('py-fix-scope-cloze-1'), q('py-test-fixture-scope'), q('py-fix-autouse-cloze-1'), q('py-test-autouse'),
  q('py-fix-tmppath-cloze-1'), q('py-fix-tmppath-1'), q('py-fix-capsys-cloze-1'), q('py-fix-capsys-1'), q('py-test-int-fixture-parametrize'), q('py-fix-conftest-1'),
  q('py-fix-paramfixture-cloze-1'), q('py-fix-param-fixture-1'), q('py-adv-test-1'),

  // ===== Topic.PY_MOCKING =====
  q('py-mock-1'), q('py-testing-predict-1'), q('py-testing-predict-2'), q('py-mock-predict-3'),
  q('py-mock-cloze-1'), q('py-testing-cloze-3'), q('py-mock-3'), q('py-mock-assertcalled-cloze-1'), q('py-mock-6'),
  q('py-mock-precedence-1'), q('py-testing-parsons-5'), q('py-mock-2'), q('py-mock-7'),
  q('py-mock-5'), q('py-mock-anycall-cloze-1'), q('py-mock-8'), q('py-mock-spec-1'), q('py-adv-test-2'),
  q('py-mock-4'), q('py-mock-mockcalls-cloze-1'), q('py-mock-9'),

  // ===== Topic.PY_SECURITY =====
  q('py-security-1'), q('py-security-mcq-digest-sizes'), q('py-security-predict-2'), q('py-security-predict-4'),
  q('py-security-predict-6'), q('py-security-predict-9'), q('py-security-predict-11'), q('py-security-predict-12'),
  q('py-security-parsons-1'), q('py-security-parsons-2'), q('py-security-parsons-6'), q('py-security-parsons-8'),
  q('py-security-parsons-11'), q('py-security-parsons-12'), q('py-security-cloze-1'), q('py-security-cloze-10'),
  q('py-security-cloze-5'), q('py-security-cloze-7'), q('py-security-cloze-8'), q('py-security-cloze-9'),
  q('py-security-cloze-11'), q('py-security-cloze-12'), q('py-security-2'), q('py-security-3'),
  q('py-security-5'), q('py-security-6'), q('py-security-parsons-10'), q('py-security-parsons-5'),
  q('py-security-cloze-2'), q('py-security-cloze-6'), q('py-security-4'), q('py-security-predict-10'),
  q('py-security-predict-3'), q('py-security-predict-5'), q('py-security-predict-7'), q('py-security-parsons-3'),
  q('py-security-parsons-4'), q('py-security-parsons-7'), q('py-security-parsons-9'), q('py-security-cloze-3'),
  q('py-security-cloze-4'),

  // ===== Topic.PY_SHELL_OS =====
  q('py-shell-predict-1'), q('py-shell-parsons-1'), q('py-shell-parsons-2'), q('py-shell-parsons-3'),
  q('py-shell-parsons-4'), q('py-shell-cloze-1'), q('py-shell-cloze-2'), q('py-shell-cloze-3'),
  q('py-shell-cloze-4'), q('py-shell-2'), q('py-shell-4'), q('py-shell-6'),
  q('py-shell-1'), q('py-shell-calledprocesserror-cloze-1'), q('py-shell-3'), q('py-shell-5'),

  // ===== Topic.PY_CLI =====
  q('py-cli-1'), q('py-cli-predict-1'), q('py-cli-predict-2'), q('py-cli-parsons-beg-1'),
  q('py-cli-parsons-beg-2'), q('py-cli-parsons-beg-3'), q('py-cli-parsons-9'), q('py-cli-parsons-7'),
  q('py-cli-parsons-1'), q('py-cli-parsons-4'), q('py-cli-parsons-6'), q('py-cli-parsons-8'),
  q('py-cli-cloze-1'), q('py-cli-cloze-2'), q('py-cli-cloze-3'), q('py-cli-cloze-4'),
  q('py-cli-2'), q('py-cli-3'), q('py-cli-5'), q('py-cli-4'),
  q('py-cli-6'), q('py-cli-int-parsons-1'), q('py-cli-int-1'), q('py-cli-adv-1'),

  // ===== Topic.PY_PACKAGING =====
  q('py-packaging-1'), q('py-packaging-2'), q('py-packaging-3'), q('py-packaging-4'),
  q('py-packaging-6'), q('py-packaging-5'),

  // ===== Topic.PY_DAILY_PATTERNS =====
  q('be-infra-patterns-3'), q('be-infra-patterns-4'), q('be-infra-patterns-1'), q('be-infra-patterns-2'),
  q('be-infra-patterns-5'),

  // ===== Topic.PY_MODERN =====
  q('be-infra-modern-1'), q('be-infra-modern-3'), q('py-modern-predict-2'), q('py-modern-predict-3'),
  q('py-modern-predict-6'), q('py-modern-predict-8'), q('py-modern-parsons-10'), q('py-modern-parsons-3'),
  q('py-modern-parsons-4'), q('py-modern-parsons-5'), q('py-modern-cloze-10'), q('py-modern-cloze-2'),
  q('py-modern-cloze-3'), q('py-modern-cloze-4'), q('py-modern-cloze-5'), q('py-modern-cloze-6'),
  q('py-modern-predict-1'), q('py-modern-predict-10'), q('py-modern-predict-4'), q('py-modern-parsons-1'),
  q('py-modern-cloze-1'), q('be-infra-modern-2'), q('py-modern-predict-5'), q('py-modern-predict-7'),
  q('py-modern-predict-9'), q('py-modern-parsons-2'), q('py-modern-parsons-6'), q('py-modern-parsons-7'),
  q('py-modern-parsons-8'), q('py-modern-parsons-9'), q('py-modern-cloze-7'), q('py-modern-cloze-8'),
  q('py-modern-cloze-9'),

  // ===== Topic.PY_OOP_ADVANCED =====
  q('py-oopadv-beg-1'), q('py-oopadv-beg-2'), q('py-oopadv-beg-3'), q('py-oopadv-beg-4'),
  q('py-oopadv-beg-5'), q('py-oop-parsons-10'), q('pcpp-inherit-1'), q('pcpp-encap-1'),
  q('pcpp-compose-1'), q('pcpp-builtin-1'), q('pcpp-abc-1'), q('pcpp-copy-1'),
  q('pcpp-prop-1'), q('py-oop-parsons-4'), q('py-oop-parsons-6'), q('py-oop-cloze-5'),
  q('py-oop-cloze-6'), q('py-oop-cloze-11'), q('pcpp-encap-2'), q('pcpp-compose-2'),
  q('pcpp-builtin-2'), q('pcpp-abc-2'), q('py-oop-copy-cloze-1'), q('pcpp-copy-2'), q('pcpp-prop-2'),
  q('py-dec-5'), q('py-oop-predict-2'), q('py-oop-predict-8'), q('py-oop-predict-9'),
  q('py-oop-cloze-9'), q('py-oop-3'),

  // ===== Topic.PY_METACLASSES =====
  q('py-meta-beg-1'), q('py-meta-beg-2'), q('py-meta-beg-4'), q('py-meta-beg-3'),
  q('pcpp-meta-5'), q('py-meta-int-1'), q('py-meta-int-2'), q('py-meta-introspect-cloze-1'), q('pcpp-meta-6'),
  q('pcpp-meta-1'), q('pcpp-meta-3'), q('py-meta-typector-cloze-1'), q('pcpp-meta-2'), q('py-meta-newoverride-cloze-1'), q('pcpp-meta-4'),

  // ===== Topic.DJ_SETUP =====
  q('dj-setup-1'), q('py-dj-setup-what-is-app'), q('py-dj-setup-manage-commands'), q('dj-setup-shell-mcq-1'),
  q('py-dj-setup-parsons-1'), q('py-dj-setup-parsons-2'), q('py-dj-setup-cloze-1'), q('py-dj-setup-cloze-2'),
  q('dj-setup-shell-cloze-1'), q('py-dj-setup-installed-apps'), q('py-dj-setup-settings-structure'), q('dj-setup-fixtures-mcq-1'),
  q('dj-setup-showmigrations-mcq-1'), q('dj-setup-dbshell-flush-mcq-1'), q('dj-setup-gap-1'), q('dj-setup-fixtures-cloze-1'),
  q('dj-setup-reverse-migrate-cloze-1'), q('dj-setup-gap-2'),

  // ===== Topic.DJ_MODELS =====
  q('dj4e-fk-1'), q('dj4e-fk-2'), q('dj4e-m2m-1'), q('dj-models-predict-1'),
  q('dj-models-parsons-1'), q('dj-models-parsons-2'), q('dj-models-cloze-1'), q('dj-models-cloze-2'),
  q('dj-models-cloze-3'), q('dj-model-1'), q('dj-model-2'), q('dj-model-str'),
  q('dj-model-meta'), q('dj-models-constraint-mcq-1'), q('dj-models-index-mcq-1'), q('dj-models-choices-mcq-1'),
  q('dj-models-o2o-mcq-1'), q('dj-models-selffk-mcq-1'), q('dj-models-abstract-mcq-1'), q('dj-models-save-mcq-1'),
  q('dj-models-validator-mcq-1'), q('dj4e-fk-3'), q('dj4e-fk-5'), q('dj4e-m2m-3'),
  q('dj4e-m2m-5'), q('dj-models-predict-2'), q('dj-models-predict-3'), q('dj-models-choices-predict-1'),
  q('dj-models-save-predict-1'), q('dj-models-parsons-3'), q('dj-models-abstract-parsons-1'), q('dj-models-index-cloze-1'),
  q('dj-models-choices-cloze-1'), q('dj-models-selffk-cloze-1'), q('dj-models-save-cloze-1'), q('dj-models-validator-cloze-1'),
  q('dj-models-uuid-cloze-1'), q('dj-models-o2o-cloze-1'), q('dj-models-o2o-1'), q('dj-models-save-1'),
  q('dj-models-uuid-1'), q('dj4e-fk-4'), q('dj-models-m2m-cloze-1'), q('dj4e-m2m-2'),
  q('dj-models-m2m-through-cloze-1'), q('dj4e-m2m-4'), q('dj-models-constraint-cloze-1'),
  q('dj-models-constraint-adv-1'), q('dj-models-abstract-adv-1'),

  // ===== Topic.DJ_VIEWS =====
  q('dj4e-http-1'), q('dj4e-http-2'), q('dj4e-http-3'), q('dj4e-http-4'),
  q('dj4e-mvc-1'), q('dj4e-mvc-2'), q('dj4e-session-1'), q('dj4e-session-2'),
  q('dj-views-gap-1'), q('dj-views-predict-1'), q('dj-views-parsons-1'), q('dj-views-cloze-1'),
  q('dj-view-httpresponse'), q('dj-view-render'), q('dj-view-param'), q('dj-view-404'),
  q('dj-view-post'), q('dj-views-redirect-mcq-1'), q('dj-views-require-mcq-1'),
  q('dj-views-json-mcq-1'), q('dj-views-headers-mcq-1'), q('dj-views-upload-mcq-1'), q('dj4e-session-5'),
  q('dj4e-csrf-1'), q('dj4e-urls-1'), q('dj4e-urls-2'), q('dj-views-predict-2'),
  q('dj-views-require-predict-1'), q('dj-views-redirect-cloze-1'), q('dj-views-require-cloze-1'), q('dj-views-json-cloze-1'),
  q('dj-views-headers-cloze-1'), q('dj-views-upload-cloze-1'), q('dj-view-1'), q('dj-views-redirect-1'),
  q('dj4e-session-3'), q('dj4e-session-4'), q('dj-views-paginator-cloze-1'), q('dj-views-adv-6'),
  q('dj-views-upload-1'),

  // ===== Topic.DJ_CBV =====
  q('dj-cbv-beg-whatis'), q('dj-cbv-beg-generic'), q('dj-cbv-beg-asview'), q('dj-cbv-beg-which'),
  q('dj4e-cbv-1'), q('dj4e-cbv-5'), q('dj4e-cbv-7'), q('dj-cbv-int-userpasses'),
  q('dj-cbv-context-mcq-1'), q('dj-cbv-template-mcq-1'), q('dj-cbv-slug-mcq-1'), q('dj-cbv-httpmethods-mcq-1'),
  q('dj-cbv-formview-mcq-1'), q('dj-cbv-listview-parsons-1'), q('dj-cbv-listview-cloze-1'),
  q('dj-cbv-context-cloze-1'), q('dj-cbv-template-cloze-1'), q('dj-cbv-slug-cloze-1'), q('dj-cbv-formview-cloze-1'),
  q('be-dj-cbv-1'), q('dj4e-cbv-2'), q('dj-cbv-createview-cloze-1'), q('dj4e-cbv-3'), q('dj4e-cbv-4'),
  q('dj4e-cbv-6'), q('dj4e-cbv-8'), q('dj-cbv-context-1'), q('dj-cbv-adv-4'),
  q('dj-cbv-adv-1'), q('dj-cbv-adv-2'), q('dj-cbv-adv-3'), q('dj-cbv-formview-1'),

  // ===== Topic.DJ_TEMPLATES =====
  q('dj4e-tmpl-2'), q('dj4e-tmpl-1'), q('py-dj-tpl-context-processors'), q('py-dj-tpl-parsons-1'),
  q('py-dj-tpl-parsons-2'), q('py-dj-tpl-cloze-1'), q('py-dj-tpl-cloze-2'), q('py-dj-tpl-cloze-3'),
  q('dj-tmpl-1'), q('py-dj-tpl-url-tag'), q('py-dj-tpl-cloze-4'), q('dj-tmpl-3'),
  q('py-dj-tpl-cloze-5'), q('dj-tmpl-4'), q('py-dj-tpl-inheritance'), q('py-dj-tpl-include'),
  q('dj-templates-custom-filter-cloze-1'), q('py-dj-tpl-custom-filter'),

  // ===== Topic.DJ_URLS =====
  q('dj-url-4'), q('py-dj-urls-parsons-1'), q('py-dj-urls-parsons-2'), q('py-dj-urls-cloze-1'),
  q('py-dj-urls-cloze-2'), q('py-dj-urls-cloze-3'), q('py-dj-urls-path-basic'), q('py-dj-urls-converters'),
  q('py-dj-urls-include'), q('py-dj-urls-namespace'), q('py-dj-urls-cloze-4'), q('py-dj-urls-re-path'), q('py-dj-urls-reverse'),

  // ===== Topic.DJ_FORMS =====
  q('dj-forms-gap-1'), q('dj-forms-predict-1'), q('dj-forms-predict-3'), q('dj-forms-parsons-1'),
  q('dj-forms-cloze-1'), q('py-dj-form-modelform'), q('dj-forms-parsons-2'), q('dj-forms-cloze-2'),
  q('py-dj-form-clean-field'), q('dj-forms-clean-cross-cloze-1'),
  q('py-dj-form-clean-cross-field'), q('dj-forms-widgets-cloze-1'), q('py-dj-form-widgets'), q('dj-form-3'),
  q('dj-forms-plainform-cloze-1'), q('dj-forms-gap-2'), q('py-dj-form-vs-modelform'),
  q('dj-forms-validators-mcq-1'), q('dj-forms-choicefield-mcq-1'), q('dj-forms-kwargs-mcq-1'), q('dj-forms-commit-mcq-1'),
  q('dj4e-forms-1'), q('dj-forms-predict-2'), q('dj-forms-commit-predict-1'),
  q('dj-forms-parsons-3'), q('dj-forms-cloze-3'), q('dj-forms-validators-cloze-1'),
  q('dj-forms-choicefield-cloze-1'), q('dj-forms-modelchoice-cloze-1'), q('dj-forms-kwargs-cloze-1'), q('py-dj-form-cleaneddata'),
  q('dj-forms-modelchoice-1'), q('dj-forms-commit-1'), q('dj4e-forms-2'), q('dj-forms-adv-2'),
  q('dj-forms-dynamic-parsons-1'), q('dj-forms-adv-1'), q('dj-forms-dynamic-1'),

  // ===== Topic.DJ_ORM =====
  q('dj-orm-gap-1'), q('dj-orm-predict-1'), q('dj-orm-parsons-1'), q('dj-orm-parsons-4'),
  q('dj-orm-parsons-5'), q('dj-orm-cloze-1'), q('dj-orm-cloze-4'), q('dj-orm-cloze-5'),
  q('dj-orm-cloze-6'), q('dj-orm-exists-cloze-1'), q('dj-orm-values-cloze-1'), q('dj-orm-1'),
  q('dj-orm-2'), q('dj-orm-gap-2'), q('dj-orm-6'), q('py-dj-orm-select-vs-prefetch'),
  q('dj-orm-only-mcq-1'), q('dj-orm-bulk-mcq-1'), q('dj-orm-values-mcq-1'), q('dj-orm-subquery-mcq-1'),
  q('dj-orm-prefetch-obj-mcq-1'), q('dj-orm-predict-2'), q('dj-orm-predict-3'), q('dj-orm-exists-predict-1'),
  q('dj-orm-values-predict-1'), q('dj-orm-parsons-2'), q('dj-orm-parsons-3'), q('dj-orm-case-parsons-1'),
  q('dj-orm-bulk-parsons-1'), q('dj-orm-cloze-2'), q('dj-orm-cloze-3'), q('dj-orm-case-cloze-1'),
  q('dj-orm-only-cloze-1'), q('dj-orm-bulk-cloze-1'), q('py-dj-orm-q'), q('py-dj-orm-f'),
  q('py-dj-orm-select-related'), q('py-dj-orm-prefetch'), q('py-dj-orm-aggregate-annotate'), q('dj-orm-exists-1'),
  q('dj-orm-bulk-1'), q('dj-orm-subquery-cloze-1'), q('dj-orm-prefetch-obj-cloze-1'), q('dj-orm-3'),
  q('dj-orm-adv-1'), q('dj-orm-adv-2'), q('dj-orm-queryset-manager-cloze-1'), q('dj-orm-adv-3'),
  q('dj-orm-case-adv-1'),
  q('dj-orm-subquery-adv-1'), q('dj-orm-prefetch-obj-adv-1'),

  // ===== Topic.DJ_AUTH =====
  q('py-dj-auth-user-model'), q('py-dj-auth-login-required'), q('be-auth-4'), q('py-dj-auth-parsons-1'),
  q('py-dj-auth-parsons-2'), q('py-dj-auth-cloze-1'), q('py-dj-auth-cloze-2'), q('py-dj-auth-cloze-3'),
  q('dj-auth-getusermodel-cloze-1'), q('be-auth-2'), q('py-dj-auth-authenticate-login'), q('dj-auth-setpassword-cloze-1'),
  q('py-dj-auth-password-hashing'), q('dj-auth-customuser-cloze-1'), q('py-dj-auth-custom-user'),
  q('py-dj-auth-session-vs-token'), q('dj4e-owned-1'), q('dj-auth-groups-mcq-1'),
  q('dj-auth-getusermodel-mcq-1'), q('dj-auth-custperm-mcq-1'), q('dj-auth-accessmixins-mcq-1'), q('dj-auth-authviews-mcq-1'),
  q('py-dj-auth-predict-1'), q('py-dj-auth-parsons-3'), q('py-dj-auth-cloze-4'), q('dj-auth-groups-cloze-1'),
  q('dj-auth-custperm-cloze-1'), q('dj-auth-permmixin-cloze-1'), q('dj-auth-userpasses-cloze-1'), q('dj-auth-authviews-cloze-1'),
  q('py-dj-auth-permission-required'), q('dj-auth-usercreationform-cloze-1'), q('py-dj-auth-register-view'),
  q('dj-auth-jwt-cloze-1'), q('be-auth-3'), q('dj4e-owned-2'),
  q('dj4e-owned-3'), q('dj-auth-groups-1'), q('dj-auth-adv-4'), q('dj-auth-adv-1'),
  q('dj-auth-adv-2'), q('dj-auth-adv-3'), q('dj-auth-userpasses-1'),

  // ===== Topic.DJ_REST =====
  q('dj-rest-gap-1'), q('dj-drf-predict-1'), q('dj-drf-parsons-1'), q('dj-drf-cloze-1'),
  q('dj-drf-apiview-fbv-cloze-1'), q('dj-rest-1'), q('dj-drf-apiview-cloze-1'), q('dj-rest-2'),
  q('dj-drf-modelviewset-cloze-1'), q('py-drf-modelviewset'), q('dj-drf-router-cloze-1'), q('py-drf-router'),
  q('dj-drf-validatefield-cloze-1'), q('py-drf-serializer-validator'), q('dj-drf-methodfield-cloze-1'), q('py-drf-method-field'),
  q('dj-drf-nested-cloze-1'), q('py-drf-nested-serializer'), q('dj-drf-permclass-cloze-1'), q('py-drf-permission-class'),
  q('dj-drf-pagination-cloze-1'), q('py-drf-pagination'), q('dj-drf-filtering-cloze-1'), q('dj-rest-5'),
  q('dj-drf-apiview-fbv-1'),
  q('dj-rest-gap-2'), q('py-drf-apiview-vs-viewset'), q('dj-drf-apiview-fbv-mcq-1'), q('dj-drf-writeonly-mcq-1'),
  q('dj-drf-context-mcq-1'), q('dj-drf-relational-mcq-1'), q('dj-drf-getserializer-mcq-1'), q('dj-drf-throttle-mcq-1'),
  q('dj-drf-predict-2'), q('dj-drf-predict-3'), q('dj-drf-parsons-2'), q('dj-drf-parsons-3'),
  q('dj-drf-cloze-2'), q('dj-drf-cloze-3'), q('dj-drf-writeonly-cloze-1'), q('dj-drf-relational-cloze-1'),
  q('dj-drf-validate-cloze-1'), q('dj-drf-throttle-cloze-1'), q('dj-drf-writeonly-1'), q('dj-drf-validate-1'),
  q('dj-drf-getserializer-cloze-1'), q('dj-rest-4'), q('dj-drf-basepermission-cloze-1'), q('dj-drf-adv-1'),
  q('dj-drf-adv-2'), q('dj-drf-getserializer-1'),

  // ===== Topic.DJ_PAGINATION_GENERICS =====
  q('dj-pagination-gap-1'), q('dj-pagination-gap-2'), q('celery-drf-17'), q('dj-pagination-generics-cloze-1'),
  q('celery-drf-13'), q('celery-drf-14'), q('dj-pagination-custom-cloze-1'), q('celery-drf-16'),

  // ===== Topic.DJ_CUSTOM_MANAGERS =====
  q('dj-custom-managers-gap-1'), q('dj-custom-managers-cloze-1'), q('celery-drf-22'), q('celery-drf-24'),
  q('celery-drf-25'), q('dj-custom-managers-queryset-cloze-1'), q('celery-drf-23'),

  // ===== Topic.DJ_SIGNALS_MW =====
  q('dj-signals-mw-gap-1'), q('dj-signals-mw-gap-2'), q('py-dj-mw-what'), q('dj-sigmw-3'),
  q('dj-middleware-parsons-1'), q('dj-signals-cloze-1'), q('py-dj-signal-post-save-profile'), q('dj-signals-appconfig-cloze-1'),
  q('py-dj-signal-register-ready'),
  q('py-dj-mw-custom'), q('dj-sigmw-2'), q('py-dj-mw-order'), q('dj-signals-mw-adv-1'),
  q('dj-models-adv-2'),

  // ===== Topic.DJ_CACHING =====
  q('dj-caching-gap-1'), q('py-dj-cache-why'), q('dj-caching-cloze-1'), q('dj-caching-getset-cloze-1'),
  q('py-dj-cache-get-set'), q('py-dj-cache-page'), q('dj-caching-getorset-cloze-1'), q('py-dj-cache-getorset'),
  q('dj-caching-gap-2'), q('py-dj-cache-backends'), q('dj-caching-predict-1'), q('dj-caching-parsons-1'),
  q('dj-caching-signal-cloze-1'), q('py-dj-cache-invalidate'), q('dj-cache-2'),

  // ===== Topic.DJ_TRANSACTIONS =====
  q('dj-transactions-gap-1'), q('py-dj-tx-what'), q('dj-transactions-parsons-1'), q('py-dj-tx-atomic-decorator'),
  q('py-dj-tx-atomic-block'), q('dj-transactions-selectforupdate-cloze-1'), q('py-dj-tx-select-for-update'), q('dj-transactions-savepoint-cloze-1'),
  q('py-dj-tx-savepoint'), q('dj-transactions-gap-2'),
  q('py-dj-tx-atomic-requests'), q('dj-transactions-predict-1'), q('dj-tx-1'),

  // ===== Topic.DJ_MANAGEMENT =====
  q('dj-management-gap-1'), q('dj-management-parsons-1'), q('dj-mgmt-1'), q('dj-mgmt-2'),
  q('dj-mgmt-runscript-mcq-1'), q('dj-mgmt-call-command-mcq-1'), q('dj-mgmt-check-deploy-mcq-1'), q('dj-mgmt-django-setup-parsons-1'),
  q('dj-management-cloze-1'), q('dj-mgmt-django-setup-cloze-1'), q('dj-mgmt-call-command-cloze-1'),

  // ===== Topic.DJ_SERVICE_LAYER =====
  q('dj-service-layer-gap-1'), q('be-infra-service-2'), q('dj-service-layer-cloze-1'), q('be-infra-service-1'),
  q('be-infra-service-3'),

  // ===== Topic.DJ_ORM_MASTERY =====
  q('dj-orm-mastery-window-mcq-1'), q('dj-orm-mastery-lock-mcq-1'), q('dj-orm-mastery-nplus1-mcq-1'), q('dj-orm-mastery-perf-mcq-1'),
  q('dj-orm-mastery-perf-mcq-2'), q('dj-orm-mastery-window-lag-mcq-2'), q('dj-orm-mastery-nplus1-mcq-2'), q('dj-orm-mastery-perf-mcq-3'),
  q('dj-orm-mastery-perf-predict-1'), q('dj-orm-mastery-window-parsons-1'), q('dj-orm-mastery-window-cloze-1'), q('dj-orm-mastery-lock-cloze-1'),
  q('dj-orm-mastery-window-1'), q('dj-orm-mastery-lock-1'), q('dj-orm-mastery-nplus1-cloze-1'), q('dj-orm-mastery-nplus1-1'),

  // ===== Topic.DJ_MODELS_MASTERY =====
  q('dj-models-mastery-inherit-mcq-1'), q('dj-models-mastery-inherit-mcq-2'), q('dj-models-mastery-validate-mcq-1'), q('dj-models-mastery-validate-mcq-2'),
  q('dj-models-mastery-migration-mcq-1'), q('dj-models-mastery-bulk-mcq-1'), q('dj-models-mastery-integrity-mcq-1'), q('dj-models-mastery-inherit-predict-1'),
  q('dj-models-mastery-validate-predict-1'), q('dj-models-mastery-bulk-predict-1'), q('dj-models-mastery-clean-cloze-1'), q('dj-models-mastery-proxy-cloze-1'),
  q('dj-models-mastery-proxy-1'),
  q('dj-models-mastery-clean-1'),

  // ===== Topic.DJ_VIEWS_MASTERY =====
  q('dj-views-mastery-dispatch-mcq-1'), q('dj-views-mastery-decorator-mcq-1'), q('dj-views-mastery-response-mcq-1'), q('dj-views-mastery-prg-mcq-1'),
  q('dj-views-mastery-error-mcq-1'), q('dj-views-mastery-streaming-mcq-1'), q('dj-views-mastery-cache-mcq-1'), q('dj-views-mastery-dispatch-predict-1'),
  q('dj-views-mastery-methodnotallowed-predict-1'), q('dj-views-mastery-decorator-cloze-1'), q('dj-views-mastery-streaming-cloze-1'), q('dj-views-mastery-decorator-1'),
  q('dj-views-mastery-streaming-1'),

  // ===== Topic.DJ_FORMS_MASTERY =====
  q('dj-forms-mastery-lifecycle-mcq-1'), q('dj-forms-mastery-security-mcq-1'), q('dj-forms-mastery-formset-mcq-1'), q('dj-forms-mastery-errors-mcq-1'),
  q('dj-forms-mastery-file-mcq-1'), q('dj-forms-mastery-lifecycle-predict-1'), q('dj-forms-mastery-formset-predict-1'), q('dj-forms-mastery-modelform-validate-mcq-1'),
  q('dj-forms-mastery-modelform-clean-mcq-1'), q('dj-forms-mastery-savem2m-mcq-1'), q('dj-forms-mastery-dynamic-mcq-1'), q('dj-forms-mastery-savem2m-cloze-1'),
  q('dj-forms-mastery-savem2m-1'),

  // ===== Topic.DJ_AUTH_MASTERY =====
  q('dj-auth-mastery-session-fixation-mcq-1'), q('dj-auth-mastery-cookie-flags-mcq-1'), q('dj-auth-mastery-inactive-mcq-1'), q('dj-auth-mastery-superuser-perm-mcq-1'),
  q('dj-auth-mastery-passwd-validators-mcq-1'), q('dj-auth-mastery-defense-depth-mcq-1'), q('dj-auth-mastery-backends-mcq-1'), q('dj-auth-mastery-hashers-mcq-1'),
  q('dj-auth-mastery-timing-mcq-1'), q('dj-auth-mastery-objperm-mcq-1'), q('dj-auth-mastery-csrf-mcq-1'), q('dj-auth-mastery-jwt-mcq-1'),
  q('dj-auth-mastery-perm-cache-predict-1'), q('dj-auth-mastery-backend-cloze-1'), q('dj-auth-mastery-backend-1'),

  // ===== Topic.DJ_REST_MASTERY =====
  q('dj-rest-mastery-idempotency-mcq-1'), q('dj-rest-mastery-status-mcq-1'), q('dj-rest-mastery-putpatch-mcq-1'), q('dj-rest-mastery-authclasses-mcq-1'),
  q('dj-rest-mastery-lifecycle-mcq-1'), q('dj-rest-mastery-negotiation-mcq-1'), q('dj-rest-mastery-hyperlinked-mcq-1'), q('dj-rest-mastery-nplus1-mcq-1'),
  q('dj-rest-mastery-save-predict-1'), q('dj-rest-mastery-throttle-mcq-1'), q('dj-rest-mastery-versioning-mcq-1'), q('dj-rest-mastery-nplus1-predict-1'),
  q('dj-rest-mastery-exception-cloze-1'), q('dj-rest-mastery-exception-1'),

  // ===== Topic.DJ_ADMIN =====
  q('py-dj-admin-what'), q('dj-admin-predict-1'), q('dj-admin-cloze-1'), q('py-dj-admin-register'),
  q('py-dj-admin-list-display'), q('dj-admin-inline-cloze-1'), q('py-dj-admin-inline'), q('dj-admin-action-cloze-1'),
  q('py-dj-admin-action'), q('dj-admin-fieldsets-cloze-1'), q('py-dj-admin-readonly-fieldsets'),
  q('py-dj-admin-prod-risk'), q('dj-admin-adv-1'),

  // ===== Topic.DJ_DEPLOYMENT =====
  q('py-dj-deploy-debug'), q('py-dj-deploy-12factor'), q('be-docker-1'), q('py-dj-deploy-gunicorn'),
  q('py-dj-deploy-allowed-hosts'), q('py-dj-deploy-collectstatic'), q('py-dj-deploy-whitenoise'), q('be-docker-2'),
  q('dj-deploy-1'), q('dj-deploy-3'), q('dj-deploy-compose-cloze-1'), q('be-docker-3'), q('dj-deploy-2'),

  // ===== Topic.DJ_FACTORY_BOY =====
  q('py-dj-factory-what'), q('dj-factoryboy-cloze-1'), q('py-dj-factory-userfactory'), q('py-dj-factory-subfactory'),
  q('dj-factoryboy-trait-cloze-1'), q('py-dj-factory-traits'), q('dj-factoryboy-batch-cloze-1'), q('py-dj-factory-usage-test'),
  q('py-dj-factory-vs-fixture'),

  // ===== Topic.DJ_CICD =====
  q('py-dj-cicd-what'), q('py-dj-cicd-gha-tests'), q('py-dj-cicd-gha-matrix'), q('py-dj-cicd-gha-cache'),
  q('py-dj-cicd-secrets'), q('dj-cicd-parsons-1'), q('py-dj-cicd-deploy-step'),

  // ===== Topic.DJ_NGINX =====
  q('be-infra-nginx-3'), q('dj-nginx-proxypass-cloze-1'), q('be-infra-nginx-1'), q('be-infra-nginx-2'),

  // ===== Topic.DJ_SETTINGS =====
  q('be-infra-settings-2'), q('be-infra-settings-3'), q('dj-settings-cloze-1'), q('be-infra-settings-1'),

  // ===== Topic.DJ_FILE_UPLOADS =====
  q('be-infra-uploads-3'), q('dj-uploads-basics-cloze-1'), q('be-infra-uploads-1'), q('be-infra-uploads-2'),

  // ===== Topic.DJ_POSTGRES =====
  q('be-infra-postgres-2'), q('dj-postgres-gap-1'), q('dj-postgres-gap-2'), q('be-infra-dbperf-4'),
  q('dj-postgres-predict-1'), q('dj-postgres-cloze-1'), q('dj-postgres-keytexttransform-cloze-1'), q('be-infra-postgres-1'),
  q('be-infra-postgres-4'), q('be-infra-dbperf-3'), q('dj-postgres-fts-cloze-1'), q('be-infra-postgres-3'),
  q('be-infra-dbperf-1'), q('be-infra-dbperf-2'),
  q('dj-postgres-adv-1'), q('dj-postgres-adv-2'),

  // ===== Topic.DJ_API_DOCS =====
  q('celery-drf-19'), q('celery-drf-21'), q('dj-api-docs-cloze-1'), q('dj-api-docs-urls-cloze-1'), q('celery-drf-18'),
  q('dj-api-docs-extendschema-cloze-1'), q('celery-drf-20'),

  // ===== Topic.DJ_CELERY =====
  q('celery-drf-4'), q('celery-drf-7'), q('dj-celery-gap-1'), q('dj-celery-gap-2'),
  q('dj-celery-predict-1'), q('dj-celery-parsons-1'), q('dj-celery-cloze-1'), q('dj-celery-appconfig-cloze-1'),
  q('celery-drf-2'), q('celery-drf-1'), q('celery-drf-3'), q('celery-drf-6'),
  q('celery-drf-5'), q('dj-celery-composition-cloze-1'), q('celery-drf-8'), q('dj-celery-chord-cloze-1'), q('dj-celery-adv-1'),

  // ===== Topic.DJ_REDIS =====
  q('celery-drf-9'), q('celery-drf-11'), q('dj-redis-gap-1'),

  // ===== Topic.DJ_CHANNELS =====
  q('be-infra-channels-1'), q('dj-channels-gap-1'), q('dj-channels-cloze-1'), q('be-infra-channels-3'),
  q('be-infra-channels-4'), q('dj-channels-groupsend-cloze-1'), q('be-infra-channels-2'),

  // ===== Topic.DJ_MONITORING =====
  q('be-infra-monitoring-3'), q('be-infra-monitoring-1'), q('dj-monitoring-extra-cloze-1'), q('be-infra-monitoring-2'),
];
