import { Question, QuestionType, Difficulty, Topic, CodeLanguage } from '../types';

export const DATABRICKS_PLATFORM_EXPANSION_QUESTIONS: Question[] = [
  // =========================================================================
  // TOPIC 1: DATABRICKS_COMPUTE_ADMIN (Compute & Cluster Administration)
  // =========================================================================

  {
    id: 'dbx-compute-admin-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'Why must the Driver node of a Databricks production cluster be configured as an On-Demand instance rather than a Spot instance?',
    options: [
      { id: 'a', text: 'Spot instances do not support SparkContext initialization or Web UI hosting.', isCorrect: false },
      { id: 'b', text: 'Driver nodes require specialized bare-metal hardware architectures unavailable on Spot.', isCorrect: false },
      { id: 'c', text: 'Spot eviction of the driver node terminates the cluster and fails the running job immediately.', isCorrect: true },
      { id: 'd', text: 'Databricks Runtime licensing blocks Photon execution on Spot driver instances.', isCorrect: false },
    ],
    explanation: 'If a cloud provider reclaims a Spot instance acting as a Driver node, the SparkContext fails and the entire cluster terminates immediately. Workers can use Spot with On-Demand fallbacks, but the Driver must remain On-Demand for resilience.',
    hints: ['Think about what component manages the SparkContext and DAG execution.'],
    tags: ['clusters', 'spot', 'driver'],
    concepts: ['dbx-spot-on-demand', 'dbx-architecture'],
  },

  {
    id: 'dbx-compute-admin-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'Which cluster access mode should be selected to allow multiple data analysts to share an All-Purpose cluster while enforcing table-level Unity Catalog permissions and user process isolation?',
    options: [
      { id: 'a', text: 'No Isolation Shared', isCorrect: false },
      { id: 'b', text: 'Single User', isCorrect: false },
      { id: 'c', text: 'Shared', isCorrect: true },
      { id: 'd', text: 'Dedicated Custom', isCorrect: false },
    ],
    explanation: 'Shared access mode provides multi-tenant execution for Python and SQL workloads with user process isolation and fine-grained Unity Catalog access control enforcement.',
    hints: ['Focus on multi-tenant access with strict Unity Catalog isolation.'],
    tags: ['clusters', 'access-modes', 'security'],
    concepts: ['dbx-access-modes'],
  },

  {
    id: 'dbx-compute-admin-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'An administrator needs to restrict workspace developers from launching clusters with more than 8 worker nodes or using On-Demand instances for workers. How should this be enforced?',
    options: [
      { id: 'a', text: 'Set spark.sql.shuffle.partitions to 8 in global init scripts.', isCorrect: false },
      { id: 'b', text: 'Revoke CAN ATTACH TO privileges on all workspace directories.', isCorrect: false },
      { id: 'c', text: 'Add a WHERE clause filter in Unity Catalog GRANT statements.', isCorrect: false },
      { id: 'd', text: 'Apply a Cluster Policy JSON enforcing max_value constraints on autoscale and node types.', isCorrect: true },
    ],
    explanation: 'Cluster policies define rules and JSON schema constraints (e.g. max worker nodes, allowed instance types, forced tags) that users must follow when creating clusters.',
    hints: ['Look for the administrator feature designed for governing cluster configurations.'],
    tags: ['clusters', 'policies', 'governance'],
    concepts: ['dbx-cluster-policies'],
  },

  {
    id: 'dbx-compute-admin-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'A cluster fails to start after an administrator configures a new cluster-scoped init script. What is the most likely cause of the failure?',
    options: [
      { id: 'a', text: 'Init scripts run after SparkContext initialization, causing port binding conflicts.', isCorrect: false },
      { id: 'b', text: 'The init script exited with a non-zero status code, aborting cluster startup.', isCorrect: true },
      { id: 'c', text: 'Init scripts are unsupported on clusters using LTS (Long Term Support) runtimes.', isCorrect: false },
      { id: 'd', text: 'Cluster-scoped init scripts require root privileges in Unity Catalog metastores.', isCorrect: false },
    ],
    explanation: 'Init scripts execute during node provisioning before the Spark driver/workers start. If an init script fails (returns a non-zero exit code), cluster provisioning immediately aborts for safety.',
    hints: ['Consider how script return codes impact cluster startup lifecycle.'],
    tags: ['clusters', 'init-scripts', 'troubleshooting'],
    concepts: ['dbx-init-scripts'],
  },

  {
    id: 'dbx-compute-admin-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'A PySpark job processing a 500 GB Delta table fails with OutOfMemoryError on the driver node, even though the cluster has 16 worker nodes. What operation caused this issue?',
    options: [
      { id: 'a', text: 'Executing df.write.format("delta").save() without partitionBy.', isCorrect: false },
      { id: 'b', text: 'Running df.repartition(100) before performing a groupBy transformation.', isCorrect: false },
      { id: 'c', text: 'Enabling Photon execution on a multi-node cluster.', isCorrect: false },
      { id: 'd', text: 'Calling df.collect() to pull all DataFrame rows into driver local memory.', isCorrect: true },
    ],
    explanation: 'df.collect() brings all distributed rows across all executors onto the single driver node. If the data volume exceeds driver RAM, an OutOfMemoryError occurs regardless of worker cluster size.',
    hints: ['Identify the action that gathers distributed data into a single node.'],
    tags: ['clusters', 'driver', 'memory'],
    concepts: ['dbx-driver-worker-sizing', 'dbx-architecture'],
  },

  {
    id: 'dbx-compute-admin-6',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'Complete the Python utility call to fetch the notebook execution context using dbutils.',
    template: `cluster_info = dbutils.notebook.entry_point.getDbutils().___().___()`,
    blanks: ['notebook', 'getContext'],
    solution: `cluster_info = dbutils.notebook.entry_point.getDbutils().notebook().getContext()`,
    explanation: 'dbutils.notebook context utilities provide execution context details about the cluster and workspace user.',
    hints: ['Use notebook context calls.'],
    tags: ['clusters', 'context'],
    concepts: ['dbx-utilities'],
  },

  {
    id: 'dbx-compute-admin-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'What is the primary purpose of a cluster init script in Databricks, and when does it execute during the cluster lifecycle?',
    options: [
      { id: 'a', text: 'Shell scripts that run on node startup before Spark driver or worker JVMs initialize, used to install OS packages, C libraries, and environment variables.', isCorrect: true },
      { id: 'b', text: 'SQL scripts that execute inside Delta Lake after SparkContext is initialized to set up initial database schemas, catalog objects, and table access grants.', isCorrect: false },
      { id: 'c', text: 'Python hooks that run after every notebook cell completion to record driver memory usage metrics, active thread counts, and garbage collection logs.', isCorrect: false },
      { id: 'd', text: 'REST API workflows that execute periodically during auto-scaling events to balance executor nodes across cloud availability zones and subnet groups.', isCorrect: false },
    ],
    explanation: 'Init scripts are shell scripts that run on each cluster node during startup, before the Spark driver or executor JVM initializes. They are used to install custom Linux packages/libraries, set environment variables, or configure system properties across all nodes.',
    hints: ['Think about low-level node provisioning before Spark starts.'],
    tags: ['clusters', 'init-scripts', 'administration'],
    concepts: ['dbx-init-scripts'],
  },

  {
    id: 'dbx-compute-admin-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'What is the primary operational difference between an All-Purpose cluster and a Job cluster in Databricks?',
    options: [
      { id: 'a', text: 'All-Purpose clusters only run SQL queries, while Job clusters only run Python notebooks.', isCorrect: false },
      { id: 'b', text: 'Job clusters require manual startup from workspace admins, whereas All-Purpose clusters auto-start on schedule.', isCorrect: false },
      { id: 'c', text: 'All-Purpose clusters are shared interactive environments, while Job clusters terminate automatically when their assigned job finishes.', isCorrect: true },
      { id: 'd', text: 'All-Purpose clusters do not charge DBUs, whereas Job clusters charge double DBU rates.', isCorrect: false },
    ],
    explanation: 'Job clusters are provisioned dynamically for scheduled automated tasks and terminate immediately upon task completion, making them significantly cheaper for production workloads.',
    hints: ['Compare interactive shared usage vs automated scheduled execution.'],
    tags: ['clusters', 'job-cluster'],
    concepts: ['dbx-cluster-config'],
  },

  {
    id: 'dbx-compute-admin-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'An engineering team needs to run distributed machine learning model training using PyTorch and MLflow. How does Databricks Runtime for Machine Learning (DBR ML) simplify cluster setup compared to standard Databricks Runtime (DBR)?',
    options: [
      { id: 'a', text: 'DBR ML converts all PySpark DataFrames into pandas DataFrames automatically without memory overhead, driver bottlenecks, or execution plan rewrites.', isCorrect: false },
      { id: 'b', text: 'DBR ML comes pre-configured with hardware GPU drivers and popular machine learning frameworks (PyTorch, TensorFlow, MLflow, scikit-learn) pre-installed.', isCorrect: true },
      { id: 'c', text: 'DBR ML replaces Apache Spark with native Ray execution engines on worker nodes for all DataFrame aggregations, filtering, and distributed joins.', isCorrect: false },
      { id: 'd', text: 'DBR ML disables Spark auto-scaling completely to prevent worker node interruptions during single-thread model evaluation and validation cycles.', isCorrect: false },
    ],
    explanation: 'Databricks Runtime ML provides a ready-to-use cluster environment pre-installed with popular machine learning libraries (PyTorch, TensorFlow, MLflow, scikit-learn, XGBoost) and hardware acceleration drivers (CUDA/GPU).',
    hints: ['Focus on pre-bundled ML packages and GPU drivers.'],
    tags: ['clusters', 'databricks-runtime', 'ml'],
    concepts: ['dbx-runtime-ml'],
  },

  {
    id: 'dbx-compute-admin-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'What is the advantage of Databricks Photon engine over standard Spark CPU execution?',
    options: [
      { id: 'a', text: 'Photon bypasses Spark JVM and executes queries using a vectorized C++ engine tailored for modern hardware instruction sets.', isCorrect: true },
      { id: 'b', text: 'Photon removes the need for driver nodes by running SparkContext entirely on cloud object storage.', isCorrect: false },
      { id: 'c', text: 'Photon eliminates network shuffling by storing all intermediate join states in DBFS root.', isCorrect: false },
      { id: 'd', text: 'Photon allows unencrypted plain-text password sharing across shared access clusters.', isCorrect: false },
    ],
    explanation: 'Photon is Databricks native vectorized query engine written in C++ that speeds up Spark SQL and DataFrame workloads without requiring code changes.',
    hints: ['Focus on native vectorized execution.'],
    tags: ['photon', 'optimization'],
    concepts: ['dbx-architecture'],
  },

  {
    id: 'dbx-compute-admin-11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'What is the primary operational advantage of choosing a Databricks Runtime LTS (Long Term Support) release for production ETL pipelines over a standard non-LTS release?',
    options: [
      { id: 'a', text: 'LTS releases enable free, unmetered Databricks Units (DBU) for all scheduled nightly production workflow jobs running on automated job clusters.', isCorrect: false },
      { id: 'b', text: 'LTS releases bypass Unity Catalog access controls to maximize executor read throughput when querying underlying cloud object storage buckets.', isCorrect: false },
      { id: 'c', text: 'LTS releases guarantee 3 years of full support, bug fixes, and security patches without introducing breaking API changes across pipeline runs.', isCorrect: true },
      { id: 'd', text: 'LTS releases allow mixing different Apache Spark minor versions across worker nodes within the same cluster during rolling cluster upgrades.', isCorrect: false },
    ],
    explanation: 'LTS releases are supported for 3 years, offering a stable environment with critical security updates and bug fixes without breaking changes, making them ideal for mission-critical production pipelines.',
    hints: ['Think about support lifecycle duration and enterprise stability.'],
    tags: ['clusters', 'databricks-runtime', 'lts'],
    concepts: ['dbx-runtime-lts'],
  },

  {
    id: 'dbx-compute-admin-12',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'When is it recommended to deploy a Single Node cluster instead of a Multi-Node cluster in Databricks?',
    options: [
      { id: 'a', text: 'For processing multi-terabyte Delta Lake tables that require distributed parallel joins and window aggregations across multiple worker nodes.', isCorrect: false },
      { id: 'b', text: 'For high-throughput Structured Streaming pipelines processing streaming data from Apache Kafka topics with strict low-latency guarantees.', isCorrect: false },
      { id: 'c', text: 'For multi-tenant shared environments where fine-grained user process isolation across workspace data engineering teams is mandatory.', isCorrect: false },
      { id: 'd', text: 'For workloads using single-node libraries like pandas or R, small-scale data exploration, or lightweight jobs that do not need Spark worker nodes.', isCorrect: true },
    ],
    explanation: 'Single Node clusters run driver-only without worker nodes (with Spark running in local mode). They minimize cloud compute costs for non-distributed jobs, pandas/scikit-learn analysis, or lightweight data processing.',
    hints: ['Consider workloads that do not require distributed processing across workers.'],
    tags: ['clusters', 'single-node', 'compute'],
    concepts: ['dbx-single-node-compute'],
  },

  {
    id: 'dbx-compute-admin-13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'Databricks deprecates storing cluster init scripts in DBFS root (dbfs:/). Which storage locations are recommended for secure, access-controlled init script management?',
    options: [
      { id: 'a', text: 'Local node temporary directory storage (/tmp) mounted directly on worker instance root volumes during cluster creation.', isCorrect: false },
      { id: 'b', text: 'Workspace Files or Unity Catalog Volumes with access permissions governed via SQL GRANTs or workspace ACL permissions.', isCorrect: true },
      { id: 'c', text: 'Public HTTP endpoint URLs referenced directly in cluster JSON configurations without authentication headers or TLS validation.', isCorrect: false },
      { id: 'd', text: 'Unencrypted environment variable strings embedded inside notebook cell header comments across workspace repositories.', isCorrect: false },
    ],
    explanation: 'Databricks recommends storing init scripts in Workspace Files or Unity Catalog Volumes (/Volumes/...), where access can be controlled using workspace permissions or Unity Catalog SQL GRANTs, avoiding legacy DBFS root credential exposures.',
    hints: ['Look for secure storage mechanisms backed by Unity Catalog or workspace permissions.'],
    tags: ['clusters', 'init-scripts', 'security'],
    concepts: ['dbx-init-scripts-security'],
  },

  {
    id: 'dbx-compute-admin-14',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'An organization requires custom system libraries, specialized C++ bindings, and specific Python packages on all cluster nodes. What Databricks feature enables deploying custom Docker images to clusters?',
    options: [
      { id: 'a', text: 'Databricks Runtime LTS patches applied via global init scripts.', isCorrect: false },
      { id: 'b', text: 'Databricks Container Services (DCS) referencing custom Docker registry containers.', isCorrect: true },
      { id: 'c', text: 'Unity Catalog External Locations with read access to public Docker Hub images.', isCorrect: false },
      { id: 'd', text: 'Delta Live Tables pipeline configurations set to auto-compile Docker containers.', isCorrect: false },
    ],
    explanation: 'Databricks Container Services (DCS) allows administrators to build and deploy custom Docker images containing specialized OS packages, CUDA drivers, or custom C++ libraries directly onto cluster driver and worker nodes.',
    hints: ['Think about containerized base image customization for clusters.'],
    tags: ['clusters', 'docker', 'dcs'],
    concepts: ['dbx-container-services'],
  },

  {
    id: 'dbx-compute-admin-15',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'A developer attempts to attach a Scala notebook to an All-Purpose cluster configured with Shared access mode under Unity Catalog, but the execution fails. What causes this limitation?',
    options: [
      { id: 'a', text: 'Shared access mode requires all Scala code to be compiled into JAR files stored in DBFS root before execution.', isCorrect: false },
      { id: 'b', text: 'Scala execution requires Databricks Runtime for Machine Learning (DBR ML) with GPU drivers installed on all worker nodes.', isCorrect: false },
      { id: 'c', text: 'Scala execution is restricted to Single User access mode because Shared access mode does not support JVM process isolation across users.', isCorrect: true },
      { id: 'd', text: 'Unity Catalog metastores block Scala notebooks unless the cluster driver instance size is configured to 64 GB RAM.', isCorrect: false },
    ],
    explanation: 'Shared access mode provides Python and SQL user isolation under Unity Catalog. Because JVM-level execution allows arbitrary memory/class access, Scala notebooks are restricted to Single User compute for security isolation.',
    hints: ['Consider language isolation boundaries on multi-tenant Unity Catalog compute.'],
    tags: ['clusters', 'access-modes', 'scala'],
    concepts: ['dbx-access-modes-limitations'],
  },

  {
    id: 'dbx-compute-admin-16',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'What is the primary advantage of installing Python packages using %pip install within a notebook cell compared to installing libraries cluster-wide?',
    options: [
      { id: 'a', text: '%pip install persists package installations across cluster restarts and applies packages to all workspace users sharing the cluster.', isCorrect: false },
      { id: 'b', text: '%pip install provides notebook-scoped isolation, ensuring installed dependencies do not conflict with other notebooks on the cluster.', isCorrect: true },
      { id: 'c', text: '%pip install installs packages directly into underlying cloud storage buckets without consuming local node disk space.', isCorrect: false },
      { id: 'd', text: '%pip install bypasses PyPI network checks by pre-building binary wheels inside Unity Catalog metastores.', isCorrect: false },
    ],
    explanation: '%pip commands install notebook-scoped Python libraries. They isolate dependencies to the current notebook session without modifying global cluster libraries or breaking other users sharing the compute.',
    hints: ['Focus on dependency isolation across interactive notebook sessions.'],
    tags: ['clusters', 'pip', 'libraries'],
    concepts: ['dbx-notebook-scoped-libraries'],
  },

  {
    id: 'dbx-compute-admin-17',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'Why do data teams prefer Serverless SQL Warehouses over Classic SQL Warehouses for interactive Databricks SQL query dashboards?',
    options: [
      { id: 'a', text: 'Serverless SQL Warehouses store query result caches permanently in local workspace ephemeral storage volumes.', isCorrect: false },
      { id: 'b', text: 'Serverless SQL Warehouses allow developers to run custom C++ binaries and un-sandboxed shell scripts on driver nodes.', isCorrect: false },
      { id: 'c', text: 'Serverless SQL Warehouses do not charge DBUs for queries that process less than 100 GB of Delta Lake data.', isCorrect: false },
      { id: 'd', text: 'Serverless SQL Warehouses eliminate compute provisioning delay, starting instantly while shifting infrastructure management to Databricks.', isCorrect: true },
    ],
    explanation: 'Serverless SQL Warehouses run compute in Databricks-managed cloud accounts, providing instant startup (seconds vs minutes) and automatic resource management without cluster warm-up delays.',
    hints: ['Think about instant start times and serverless compute elasticity.'],
    tags: ['sql-warehouses', 'serverless', 'compute'],
    concepts: ['dbx-sql-warehouses-serverless'],
  },

  {
    id: 'dbx-compute-admin-18',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'A Databricks SQL Warehouse experiences high query concurrency during peak hours, causing queries to queue up. How should the administrator configure the warehouse to handle concurrent users without increasing single-query latency?',
    options: [
      { id: 'a', text: 'Convert the warehouse from Serverless compute to a Single Node cluster running standard Databricks Runtime.', isCorrect: false },
      { id: 'b', text: 'Increase the minimum and maximum cluster scaling limits to enable multi-cluster auto-scaling for concurrent query execution.', isCorrect: true },
      { id: 'c', text: 'Increase spark.sql.shuffle.partitions to 2000 in global cluster init scripts across all workspace nodes.', isCorrect: false },
      { id: 'd', text: 'Enforce a Cluster Policy JSON restricting users to running only 1 SQL query per hour during peak business periods.', isCorrect: false },
    ],
    explanation: 'Multi-cluster auto-scaling provisions additional clusters to handle concurrent query queues (scale-out), maintaining fast response times without requiring larger instance sizing (scale-up).',
    hints: ['Distinguish between scaling out for concurrency vs scaling up for query speed.'],
    tags: ['sql-warehouses', 'auto-scaling', 'concurrency'],
    concepts: ['dbx-sql-warehouses-scaling'],
  },

  {
    id: 'dbx-compute-admin-19',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'An admin wants a cluster policy to force all clusters created under it to use Databricks Runtime 13.3.x-scala2.12 and restrict worker nodes to a maximum of 4. Which policy JSON snippet achieves this requirement?',
    options: [
      { id: 'a', text: '{"spark_version": {"type": "allowlist", "values": ["13.3.x-scala2.12"]}, "autoscale.max_workers": {"type": "range", "maxValue": 4}}', isCorrect: false },
      { id: 'b', text: '{"runtime_version": {"type": "static", "value": "13.3.x-scala2.12"}, "workers": {"type": "limit", "value": 4}}', isCorrect: false },
      { id: 'c', text: '{"spark_version": {"type": "fixed", "value": "13.3.x-scala2.12"}, "autoscale.max_workers": {"type": "max", "value": 4}}', isCorrect: true },
      { id: 'd', text: '{"spark_version": {"type": "regex", "pattern": "13.3.*"}, "num_workers": {"type": "fixed", "value": 4}}', isCorrect: false },
    ],
    explanation: 'Cluster policy definitions use "type": "fixed" for locked property values and "type": "max" (or "max_value") to cap numeric attributes like autoscale worker counts.',
    hints: ['Look for valid Databricks Cluster Policy JSON rule types.'],
    tags: ['cluster-policies', 'json', 'governance'],
    concepts: ['dbx-cluster-policy-schema'],
  },

  {
    id: 'dbx-compute-admin-20',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'Why might a Databricks cluster fail to scale down worker nodes immediately after a heavy Spark shuffle task finishes, despite CPU utilization dropping to near zero?',
    options: [
      { id: 'a', text: 'Auto-scaling algorithms require manual admin approval before removing worker nodes from clusters attached to Unity Catalog.', isCorrect: false },
      { id: 'b', text: 'Worker node scale-down is blocked whenever global cluster init scripts run in background cron schedules.', isCorrect: false },
      { id: 'c', text: 'Cloud providers charge termination penalties if worker instances are de-provisioned within 60 minutes of cluster creation.', isCorrect: false },
      { id: 'd', text: 'Auto-scaling retains worker nodes holding active shuffle file partitions to prevent data loss until shuffle files expire or are re-shuffled.', isCorrect: true },
    ],
    explanation: 'Databricks auto-scaling considers local disk storage containing Spark shuffle files. De-provisioning a node holding shuffle data would force costly re-computation, so scale-down delays until shuffle files are cleared or unneeded.',
    hints: ['Think about Spark task shuffle data stored on local worker disks.'],
    tags: ['clusters', 'auto-scaling', 'shuffle'],
    concepts: ['dbx-autoscale-shuffle-retention'],
  },

  {
    id: 'dbx-compute-admin-21',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'Who can create and manage Global Init Scripts in a Databricks workspace, and on which compute resources do they automatically execute?',
    options: [
      { id: 'a', text: 'Any user with CAN ATTACH TO permissions can configure them, and they execute exclusively on Serverless SQL Warehouses.', isCorrect: false },
      { id: 'b', text: 'Workspace Admins configure them in Admin Settings, and they execute on all clusters launched across the entire workspace.', isCorrect: true },
      { id: 'c', text: 'Unity Catalog Metastore Admins configure them via DDL grants, and they execute only on ephemeral Job clusters.', isCorrect: false },
      { id: 'd', text: 'Workspace Developers configure them inside notebook headers, and they execute on local developer laptops before REST API calls.', isCorrect: false },
    ],
    explanation: 'Global init scripts are managed by Workspace Administrators in Admin Settings. They run on every cluster (all-purpose and job clusters) created in the workspace, ensuring uniform workspace configuration.',
    hints: ['Identify the highest workspace administrative tier and global scope.'],
    tags: ['init-scripts', 'global', 'admin'],
    concepts: ['dbx-global-init-scripts'],
  },

  {
    id: 'dbx-compute-admin-22',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'A query running on a Photon-enabled cluster includes custom Python UDFs and RDD transformations. How does the Photon execution engine handle these operations?',
    options: [
      { id: 'a', text: 'Photon automatically compiles Python UDFs into C++ machine code to maintain vectorized execution throughput.', isCorrect: false },
      { id: 'b', text: 'Photon throws a fatal runtime exception and terminates the cluster whenever Python UDFs or RDD APIs are detected.', isCorrect: false },
      { id: 'c', text: 'Photon falls back to standard Spark JVM execution for un-supported UDFs and RDDs, while running supported SQL operators in C++.', isCorrect: true },
      { id: 'd', text: 'Photon routes non-supported UDFs to Serverless SQL Warehouses while maintaining JVM execution for Delta Lake writes.', isCorrect: false },
    ],
    explanation: 'Photon seamlessly falls back to standard JVM Spark execution for unsupported features (such as Python UDFs, RDD operations, or custom Scala code), while keeping native C++ vectorized execution for supported operators.',
    hints: ['Think about graceful fallback to standard Spark JVM execution.'],
    tags: ['photon', 'udf', 'jvm-fallback'],
    concepts: ['dbx-photon-fallback'],
  },

  {
    id: 'dbx-compute-admin-23',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'Where should a workspace administrator configure custom Spark properties (such as spark.sql.shuffle.partitions) and system environment variables for a cluster?',
    options: [
      { id: 'a', text: 'Embedded as plain-text comments at the top of every workspace Python module and notebook file.', isCorrect: false },
      { id: 'b', text: 'Declared in Unity Catalog metastore level GRANT statements using ALTER CATALOG SET PROPERTIES syntax.', isCorrect: false },
      { id: 'c', text: 'Inside the Cluster Configuration UI under Advanced Options (Spark Config and Environment Variables fields).', isCorrect: true },
      { id: 'd', text: 'Hardcoded inside cloud provider IAM role trust relationship JSON documents attached to worker nodes.', isCorrect: false },
    ],
    explanation: 'Spark configuration properties and environment variables are set in the Cluster UI under Advanced Options -> Spark Config and Environment Variables fields, or defined in cluster policies.',
    hints: ['Look for the Advanced Options section in cluster configuration UI.'],
    tags: ['clusters', 'spark-config', 'env-vars'],
    concepts: ['dbx-cluster-advanced-config'],
  },

  {
    id: 'dbx-compute-admin-24',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'How does Databricks handle a cloud provider Spot instance eviction notification (2-minute warning) on a worker node in an auto-scaling cluster?',
    options: [
      { id: 'a', text: 'It immediately terminates all running jobs on the cluster and triggers a cold restart of the driver node.', isCorrect: false },
      { id: 'b', text: 'It gracefully decommissions the worker, attempts to migrate shuffle data to remaining nodes, and provisions replacement compute.', isCorrect: true },
      { id: 'c', text: 'It automatically converts the entire cluster into a Serverless SQL Warehouse without interrupting active Spark tasks.', isCorrect: false },
      { id: 'd', text: 'It ignores the cloud provider notification and allows worker node disk volumes to corrupt active Delta log files.', isCorrect: false },
    ],
    explanation: 'When an instance eviction notice is received, Databricks gracefully decommissions the worker node: stopping new task assignments on that node, migrating cached/shuffle data to healthy nodes, and requesting new worker capacity.',
    hints: ['Focus on graceful worker node decommissioning and data migration.'],
    tags: ['clusters', 'spot-eviction', 'resilience'],
    concepts: ['dbx-spot-decommissioning'],
  },

  {
    id: 'dbx-compute-admin-25',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'How do Databricks Instance Pools reduce cluster startup time and execution costs for frequent job runs?',
    options: [
      { id: 'a', text: 'Pools bypass cloud provider billing entirely by hosting compute instances inside local workspace memory caches.', isCorrect: false },
      { id: 'b', text: 'Pools automatically compile Python notebooks into C++ binaries before execution on ephemeral job clusters.', isCorrect: false },
      { id: 'c', text: 'Pools force all clusters to use Single Node access mode with unencrypted DBFS root mount points.', isCorrect: false },
      { id: 'd', text: 'Pools maintain a set of idle, pre-provisioned cloud VM instances ready to attach to clusters without cloud allocation delays.', isCorrect: true },
    ],
    explanation: 'Instance Pools maintain warm, pre-allocated cloud instances. When a cluster starts or scales up, it acquires instances from the pool instantly without waiting for cloud VM provisioning times.',
    hints: ['Think about warm pre-allocated VM instances.'],
    tags: ['clusters', 'instance-pools', 'performance'],
    concepts: ['dbx-instance-pools'],
  },

  {
    id: 'dbx-compute-admin-26',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'An administrator needs to inspect stdout/stderr logs from a cluster-scoped init script that failed during node provisioning. Where can these logs be retrieved?',
    options: [
      { id: 'a', text: 'Printed directly in the workspace notifications banner on the Databricks SQL landing page after cluster failure.', isCorrect: false },
      { id: 'b', text: 'Inside the Cluster Log Delivery path configured under Advanced Options, specifically under the init_script_format directory.', isCorrect: true },
      { id: 'c', text: 'Saved in Unity Catalog system tables under system.access.audit_logs as encrypted binary string payloads.', isCorrect: false },
      { id: 'd', text: 'Stored in local browser storage cookies on the workspace user machine that initiated the cluster startup.', isCorrect: false },
    ],
    explanation: 'When Cluster Log Delivery is enabled, init script execution logs (stdout/stderr) are delivered to the specified storage destination (e.g. DBFS or cloud storage bucket) under the init script log folder.',
    hints: ['Look for Cluster Log Delivery configuration under Advanced Options.'],
    tags: ['init-scripts', 'logging', 'troubleshooting'],
    concepts: ['dbx-cluster-log-delivery'],
  },

  {
    id: 'dbx-compute-admin-27',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'An ETL workload performs large broadcast joins and complex DataFrame aggregations that require significant driver memory, but worker tasks perform light CPU operations. What cluster node configuration is recommended?',
    options: [
      { id: 'a', text: 'Select a Single Node cluster running Databricks Runtime ML with GPU hardware acceleration enabled on worker nodes.', isCorrect: false },
      { id: 'b', text: 'Configure worker nodes as Spot instances without setting an On-Demand fallback instance type in cluster policies.', isCorrect: false },
      { id: 'c', text: 'Select a memory-optimized instance type for the Driver node and compute-optimized instance types for Worker nodes.', isCorrect: true },
      { id: 'd', text: 'Force all worker nodes to use bare-metal hardware while keeping the driver node on a two-core micro VM instance.', isCorrect: false },
    ],
    explanation: 'Databricks allows choosing different cloud VM instance types for the Driver and Workers. If driver tasks need high RAM (for broadcast joins/collects) while workers need high CPU, configuring a memory-optimized driver with compute-optimized workers optimizes performance and cost.',
    hints: ['Match instance hardware types to specific driver vs worker duties.'],
    tags: ['clusters', 'node-sizing', 'optimization'],
    concepts: ['dbx-driver-worker-heterogeneous-sizing'],
  },

  {
    id: 'dbx-compute-admin-28',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'Why does Databricks strongly discourage using No Isolation Shared access mode for multi-tenant production clusters in Unity Catalog workspaces?',
    options: [
      { id: 'a', text: 'No Isolation Shared forces all Delta Lake table writes to use single-threaded local mode execution on the driver node.', isCorrect: false },
      { id: 'b', text: 'No Isolation Shared restricts cluster startup to non-LTS Databricks Runtime releases with disabled auto-scaling.', isCorrect: false },
      { id: 'c', text: 'No Isolation Shared requires all workspace users to possess Account Admin privileges in the cloud provider console.', isCorrect: false },
      { id: 'd', text: 'No Isolation Shared does not provide user process isolation, allowing users to inspect or access credentials from other users on the cluster.', isCorrect: true },
    ],
    explanation: 'No Isolation Shared mode lacks isolation boundaries between user processes running on the same cluster nodes, risking credential exposure and bypassing Unity Catalog SQL security controls in multi-tenant environments.',
    hints: ['Consider user process isolation security boundaries.'],
    tags: ['clusters', 'access-modes', 'security'],
    concepts: ['dbx-access-modes-security'],
  },

  {
    id: 'dbx-compute-admin-29',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'How can financial managers track cloud compute infrastructure costs generated by specific departments or project teams using Databricks?',
    options: [
      { id: 'a', text: 'Set spark.sql.shuffle.partitions to unique numerical IDs corresponding to specific department budget codes.', isCorrect: false },
      { id: 'b', text: 'Apply custom cluster tags (e.g., CostCenter: Marketing) which propagate to cloud provider infrastructure billings.', isCorrect: true },
      { id: 'c', text: 'Require users to store all raw data files in separate DBFS root mount points named after department project teams.', isCorrect: false },
      { id: 'd', text: 'Deploy separate Unity Catalog metastores for every individual user in the workspace to isolate DBU billing.', isCorrect: false },
    ],
    explanation: 'Custom cluster tags are key-value pairs assigned during cluster creation that propagate to cloud provider VM billing metrics and Databricks DBU usage reports for precise cost allocation.',
    hints: ['Look for key-value tagging mechanisms propagated to cloud billing.'],
    tags: ['clusters', 'custom-tags', 'cost-management'],
    concepts: ['dbx-cluster-tags'],
  },

  {
    id: 'dbx-compute-admin-30',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'Which event resets the auto-termination timer on an active All-Purpose cluster in Databricks?',
    options: [
      { id: 'a', text: 'Background cloud provider status checks polling worker instance health metrics over internal VPC networks.', isCorrect: false },
      { id: 'b', text: 'Unity Catalog metadata sync operations occurring automatically between regional cloud metastore instances.', isCorrect: false },
      { id: 'c', text: 'Executing a notebook cell, running a job task, or sending a command via JDBC/ODBC connection to the cluster.', isCorrect: true },
      { id: 'd', text: 'Automated nightly backups of workspace notebook revision histories to underlying cloud object storage buckets.', isCorrect: false },
    ],
    explanation: 'Auto-termination monitors active commands (notebook cell runs, scheduled job tasks, REST API requests, JDBC/ODBC queries). Internal system heartbeats or background status checks do not reset the timer.',
    hints: ['Identify user or job command execution actions.'],
    tags: ['clusters', 'auto-termination', 'inactivity'],
    concepts: ['dbx-auto-termination-reset'],
  },

  {
    id: 'dbx-compute-admin-31',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'What is the output of evaluating this cluster policy max_value constraint against a requested worker count?',
    code: `policy = {"autoscale.max_workers": {"type": "max", "value": 8}}
requested_workers = 16
is_valid = requested_workers <= policy["autoscale.max_workers"]["value"]
print(is_valid)`,
    expectedOutput: `False`,
    explanation: 'The requested 16 worker nodes exceed the policy max_value limit of 8, causing cluster policy validation to evaluate to False.',
    hints: ['Compare requested_workers with policy limit value.'],
    tags: ['cluster-policies', 'validation', 'python'],
    concepts: ['dbx-cluster-policy-validation'],
  },

  {
    id: 'dbx-compute-admin-32',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'Predict the string output produced when extracting cluster execution context tags.',
    code: `context_tags = {"user": "analyst@company.com", "clusterId": "1005-120000-abcd123"}
user_email = context_tags.get("user", "unknown")
cluster_id = context_tags.get("clusterId", "unknown")
print(f"{user_email}:{cluster_id}")`,
    expectedOutput: `analyst@company.com:1005-120000-abcd123`,
    explanation: 'The notebook execution context dictionary exposes metadata attributes including the workspace user email and cluster ID.',
    hints: ['Format the user email and cluster ID separated by a colon.'],
    tags: ['dbutils', 'context', 'tags'],
    concepts: ['dbx-execution-context-extraction'],
  },

  {
    id: 'dbx-compute-admin-33',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'Rearrange the lines to form a valid Databricks Cluster Policy JSON locking spark_version to "13.3.x-scala2.12" and capping autoscale.max_workers to 8.',
    correctOrder: [
      `{`,
      `  "spark_version": {"type": "fixed", "value": "13.3.x-scala2.12"},`,
      `  "autoscale.max_workers": {"type": "max", "value": 8}`,
      `}`,
    ],
    distractorLines: [
      `  "spark_version": {"type": "allow", "value": "13.3.x-scala2.12"},`,
      `  "autoscale.max_workers": {"type": "limit", "value": 8}`,
    ],
    solution: `{
  "spark_version": {"type": "fixed", "value": "13.3.x-scala2.12"},
  "autoscale.max_workers": {"type": "max", "value": 8}
}`,
    explanation: 'Cluster policy JSON schema uses rule type "fixed" for locked runtime versions and "max" for upper numeric bounds on worker counts.',
    hints: ['Use "fixed" for exact values and "max" for upper limits.'],
    tags: ['cluster-policies', 'json', 'parsons'],
    concepts: ['dbx-cluster-policy-json-construction'],
  },

  {
    id: 'dbx-compute-admin-34',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'Rearrange the lines to construct a Python script that creates a cluster init shell script in a Unity Catalog Volume using dbutils.fs.put.',
    correctOrder: [
      `script_content = "#!/bin/bash\\napt-get update && apt-get install -y curl\\n"`,
      `volume_path = "/Volumes/main/default/scripts/env_setup.sh"`,
      `dbutils.fs.put(volume_path, script_content, overwrite=True)`,
    ],
    distractorLines: [
      `dbutils.fs.put(volume_path, script_content, force=True)`,
      `script_content = "CREATE INIT SCRIPT /Volumes/main/default/scripts/env_setup.sh"`,
    ],
    solution: `script_content = "#!/bin/bash\\napt-get update && apt-get install -y curl\\n"
volume_path = "/Volumes/main/default/scripts/env_setup.sh"
dbutils.fs.put(volume_path, script_content, overwrite=True)`,
    explanation: 'dbutils.fs.put writes file contents to path destinations in Unity Catalog Volumes or DBFS. The overwrite=True parameter enables replacing existing files.',
    hints: ['Use dbutils.fs.put with overwrite=True.'],
    tags: ['init-scripts', 'dbutils', 'volumes'],
    concepts: ['dbx-init-script-volume-creation'],
  },

  {
    id: 'dbx-compute-admin-35',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'Complete the Python utility statement to write a bash init script file to a Unity Catalog Volume.',
    template: `dbutils.fs.___("/Volumes/catalog/schema/volume/init.sh", "#!/bin/bash\\necho ready", overwrite=___)`,
    blanks: ['put', 'True'],
    solution: `dbutils.fs.put("/Volumes/catalog/schema/volume/init.sh", "#!/bin/bash\\necho ready", overwrite=True)`,
    explanation: 'dbutils.fs.put(file, contents, overwrite) creates or updates file content at a specified filesystem destination.',
    hints: ['Use put and True.'],
    tags: ['dbutils', 'fs', 'cloze'],
    concepts: ['dbx-utilities-fs-put'],
  },

  {
    id: 'dbx-compute-admin-36',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'Complete the expression to extract the active cluster ID string from dbutils notebook execution context tags.',
    template: `ctx = dbutils.notebook.entry_point.getDbutils().notebook().___()\ncluster_id = ctx.___().get("clusterId")`,
    blanks: ['getContext', 'tags'],
    solution: `ctx = dbutils.notebook.entry_point.getDbutils().notebook().getContext()\ncluster_id = ctx.tags().get("clusterId")`,
    explanation: 'The dbutils execution context exposes getContext() and tags() to access runtime properties such as clusterId.',
    hints: ['Fill getContext and tags.'],
    tags: ['dbutils', 'context', 'cluster-id', 'cloze'],
    concepts: ['dbx-context-tag-retrieval'],
  },

  {
    id: 'dbx-compute-admin-37',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'Rearrange the lines to construct a Python statement that writes an init shell script to a UC Volume path, overwriting existing files.',
    correctOrder: [
      `path = "/Volumes/main/utils/scripts/install_pkg.sh"`,
      `content = "#!/bin/bash\\npip install requests"`,
      `dbutils.fs.put(path, content, overwrite=True)`,
    ],
    distractorLines: [
      `dbutils.fs.write(path, content, force=True)`,
      `dbutils.fs.put(path, content, replace=True)`,
    ],
    solution: `path = "/Volumes/main/utils/scripts/install_pkg.sh"
content = "#!/bin/bash\\npip install requests"
dbutils.fs.put(path, content, overwrite=True)`,
    explanation: 'dbutils.fs.put accepts path, content string, and overwrite=True to persist init scripts to Volumes.',
    hints: ['Use dbutils.fs.put with overwrite=True.'],
    tags: ['dbutils', 'fs', 'put', 'init-scripts', 'parsons'],
    concepts: ['dbx-init-script-file-writing'],
  },

  {
    id: 'dbx-compute-admin-38',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'Complete the cluster policy definition dictionary to enforce a fixed runtime version and a maximum autoscale worker count.',
    template: `policy = {\n  "spark_version": {"type": "___", "value": "13.3.x-scala2.12"},\n  "autoscale.max_workers": {"type": "___", "value": 8}\n}`,
    blanks: ['fixed', 'max'],
    solution: `policy = {\n  "spark_version": {"type": "fixed", "value": "13.3.x-scala2.12"},\n  "autoscale.max_workers": {"type": "max", "value": 8}\n}`,
    explanation: 'Databricks Cluster Policy JSON rules specify "type": "fixed" for locked runtime values and "type": "max" for maximum worker thresholds.',
    hints: ['Use "fixed" for exact values and "max" for upper bounds.'],
    tags: ['cluster-policies', 'json', 'cloze'],
    concepts: ['dbx-cluster-policy-dict-builder'],
  },


  // =========================================================================
  // TOPIC 2: DATABRICKS_STORAGE_REPOS (Storage Architecture, DBFS & Git Repos)
  // =========================================================================

  {
    id: 'dbx-storage-repos-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'Why does Databricks recommend migrating from legacy DBFS mounts (/mnt) to Unity Catalog External Volumes (/Volumes)?',
    options: [
      { id: 'a', text: 'DBFS mounts require manual cluster restarts whenever underlying cloud storage bucket policies are modified.', isCorrect: false },
      { id: 'b', text: 'DBFS mounts expose storage credentials workspace-wide without fine-grained SQL access controls per user or group.', isCorrect: true },
      { id: 'c', text: 'Unity Catalog Volumes store binary object payloads in memory rather than cloud object storage buckets.', isCorrect: false },
      { id: 'd', text: 'DBFS mounts restrict file access exclusively to standard Spark SQL engine queries and prohibit Python reads.', isCorrect: false },
    ],
    explanation: 'Legacy DBFS mounts expose storage credentials across the workspace. Unity Catalog Volumes replace mounts with centralized SQL privileges (e.g. READ VOLUME, WRITE VOLUME) decoupled from compute clusters.',
    hints: ['Consider security and fine-grained access control boundaries.'],
    tags: ['dbfs', 'volumes', 'security'],
    concepts: ['dbx-dbfs-mounts-vs-volumes'],
  },

  {
    id: 'dbx-storage-repos-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities to copy file "/mnt/raw/sales.csv" to "/mnt/archive/sales.csv".',
    starterCode: `# Copy file\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.fs.cp("/mnt/raw/sales.csv", "/mnt/archive/sales.csv")',
        description: 'Should copy file',
      },
    ],
    solution: `dbutils.fs.cp("/mnt/raw/sales.csv", "/mnt/archive/sales.csv")
# OR
dbutils.fs.cp(from_path="/mnt/raw/sales.csv", to_path="/mnt/archive/sales.csv")`,
    explanation: 'dbutils.fs.cp(from_path, to_path) copies files or directories across DBFS paths.',
    hints: ['Use dbutils.fs.cp(src, dst).'],
    tieredHints: {
      apiSignature: 'dbutils.fs.cp(from: str, to: str, recurse: bool = False) -> bool',
      skeleton: '____.____.cp(____, "/mnt/archive/sales.csv")',
    },
    tags: ['dbutils', 'fs', 'cp'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

  {
    id: 'dbx-storage-repos-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities to recursively remove directory "/tmp/scratch_data/".',
    starterCode: `# Remove directory recursively\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.fs.rm("/tmp/scratch_data/", True)',
        description: 'Should remove directory recursively',
      },
    ],
    solution: `dbutils.fs.rm("/tmp/scratch_data/", True)
# OR
dbutils.fs.rm("/tmp/scratch_data/", recurse=True)`,
    explanation: 'dbutils.fs.rm(path, recurse=True) deletes a directory and all of its nested contents.',
    hints: ['Pass True or recurse=True as the second argument.'],
    tieredHints: {
      apiSignature: 'dbutils.fs.rm(dir: str, recurse: bool = False) -> bool',
      skeleton: '____.____.rm(____, True)',
    },
    tags: ['dbutils', 'fs', 'rm'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

  {
    id: 'dbx-storage-repos-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'A developer working in a Databricks Repo wants to import a helper function from a relative Python file "helpers/utils.py". What is the recommended modular pattern in modern Databricks Runtimes?',
    options: [
      { id: 'a', text: 'Import directly via standard Python syntax "from helpers.utils import my_func" because Repo root is in sys.path.', isCorrect: true },
      { id: 'b', text: 'Execute "%run ./helpers/utils.py" in a preceding cell to inject helper declarations into notebook scope.', isCorrect: false },
      { id: 'c', text: 'Compile "utils.py" into a shared wheel library artifact and attach it to the cluster via workspace libraries.', isCorrect: false },
      { id: 'd', text: 'Fetch "utils.py" onto local driver disk under "file:/tmp" using driver shell commands before execution.', isCorrect: false },
    ],
    explanation: 'Databricks Repos automatically append the Repo root directory to Python sys.path, enabling standard modular Python imports instead of relying on global variable pollution from %run.',
    hints: ['Think about standard Python modular package imports.'],
    tags: ['repos', 'python', 'modules'],
    concepts: ['dbx-git-repos-modules', 'dbx-repos'],
  },

  {
    id: 'dbx-storage-repos-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities to list all files and subdirectories under path "/Volumes/main/default/landing/".',
    starterCode: `# List volume directory contents\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.fs.ls("/Volumes/main/default/landing/")',
        description: 'Should list files in volume path',
      },
    ],
    solution: `dbutils.fs.ls("/Volumes/main/default/landing/")
# OR
dbutils.fs.ls(dir="/Volumes/main/default/landing/")`,
    explanation: 'dbutils.fs.ls(path) lists directory contents for DBFS and Unity Catalog Volume paths.',
    hints: ['Use dbutils.fs.ls(path).'],
    tieredHints: {
      apiSignature: 'dbutils.fs.ls(dir: str) -> list',
      skeleton: '____.____.ls(____)',
    },
    tags: ['dbutils', 'fs', 'ls'],
    concepts: ['dbx-utilities', 'dbx-dbfs-mounts-vs-volumes'],
  },

  {
    id: 'dbx-storage-repos-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'What happens to files written to local driver disk path "file:/tmp/cache.dat" when a Databricks cluster terminates?',
    options: [
      { id: 'a', text: 'They are automatically synced to DBFS root storage under "/user/hive/warehouse".', isCorrect: false },
      { id: 'b', text: 'They are converted into managed Delta tables inside the default Unity Catalog schema.', isCorrect: false },
      { id: 'c', text: 'They are permanently deleted because local cluster driver VM storage is ephemeral.', isCorrect: true },
      { id: 'd', text: 'They are persisted across cluster restarts within secret scope cache directories.', isCorrect: false },
    ],
    explanation: 'Local worker storage (file:/ or /tmp) is ephemeral virtual machine storage attached to cluster nodes and is completely wiped upon cluster termination.',
    hints: ['Distinguish ephemeral VM disk from persistent cloud object storage.'],
    tags: ['storage', 'dbfs', 'ephemeral'],
    concepts: ['dbx-dbfs'],
  },

  {
    id: 'dbx-storage-repos-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Arrange the steps to move file "/landing/raw.json" to "/archive/raw.json" using Databricks filesystem utilities after creating the target directory.',
    correctOrder: [
      'dbutils.fs.mkdirs("/archive")',
      'dbutils.fs.mv("/landing/raw.json", "/archive/raw.json")',
    ],
    distractorLines: [
      'dbutils.fs.mount("/landing/raw.json", "/archive/raw.json")',
    ],
    solution: `dbutils.fs.mkdirs("/archive")\ndbutils.fs.mv("/landing/raw.json", "/archive/raw.json")`,
    explanation: 'dbutils.fs.mkdirs creates missing directory structures before moving files with dbutils.fs.mv.',
    hints: ['Make directory first, then move.'],
    tags: ['dbutils', 'fs', 'mv'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

  {
    id: 'dbx-storage-repos-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'Which authentication methods are supported for connecting Databricks Repos to remote Git providers like GitHub or Azure DevOps?',
    options: [
      { id: 'a', text: 'Plaintext Databricks workspace user passwords saved to DBFS root.', isCorrect: false },
      { id: 'b', text: 'Anonymous HTTP unauthenticated public cloning protocols exclusively.', isCorrect: false },
      { id: 'c', text: 'Root cloud provider IAM secret access keys attached to cluster roles.', isCorrect: false },
      { id: 'd', text: 'Personal Access Tokens (PAT) and SSH key pairs configured in User Settings.', isCorrect: true },
    ],
    explanation: 'Databricks Repos integrates securely with Git remote providers using Personal Access Tokens (PAT) or SSH key pairs configured in User Settings.',
    hints: ['Identify standard secure developer authentication credentials for Git.'],
    tags: ['repos', 'git', 'auth'],
    concepts: ['dbx-repos'],
  },

  {
    id: 'dbx-storage-repos-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities to read the first 500 bytes of file "/mnt/logs/app.log".',
    starterCode: `# Read head bytes of file\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.fs.head("/mnt/logs/app.log", 500)',
        description: 'Should read file head',
      },
    ],
    solution: `dbutils.fs.head("/mnt/logs/app.log", 500)
# OR
dbutils.fs.head("/mnt/logs/app.log", maxBytes=500)`,
    explanation: 'dbutils.fs.head(path, maxBytes) reads up to maxBytes from the specified file as a string.',
    hints: ['Use dbutils.fs.head(path, maxBytes).'],
    tieredHints: {
      apiSignature: 'dbutils.fs.head(file: str, maxBytes: int = 65536) -> str',
      skeleton: '____.____.head(____, 500)',
    },
    tags: ['dbutils', 'fs', 'head'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

  {
    id: 'dbx-storage-repos-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'In Unity Catalog, how is read access granted to a volume path "/Volumes/finance/raw/statements/"?',
    options: [
      { id: 'a', text: 'Execute SQL: GRANT READ VOLUME ON VOLUME finance.raw.statements TO `analysts`.', isCorrect: true },
      { id: 'b', text: 'Call dbutils.fs.mount() with workspace root storage credentials inside notebook cells.', isCorrect: false },
      { id: 'c', text: 'Add target user accounts directly to the driver instance VM local /etc/sudoers group.', isCorrect: false },
      { id: 'd', text: 'Disable workspace cluster auto-termination policies and set global init script permissions.', isCorrect: false },
    ],
    explanation: 'Unity Catalog Volumes govern access via standard SQL data control language (DCL) commands like GRANT READ VOLUME on the volume object.',
    hints: ['Look for standard Unity Catalog GRANT statements.'],
    tags: ['volumes', 'grant', 'security'],
    concepts: ['dbx-dbfs-mounts-vs-volumes'],
  },

  {
    id: 'dbx-storage-repos-11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'Which URI scheme is used in Databricks to read data directly from an Azure Data Lake Storage Gen2 (ADLS Gen2) container using native Azure storage drivers?',
    options: [
      { id: 'a', text: 'wasbs://container@account.blob.core.windows.net/path', isCorrect: false },
      { id: 'b', text: 'abfss://container@account.dfs.core.windows.net/path', isCorrect: true },
      { id: 'c', text: 's3a://bucket-name/path/to/data', isCorrect: false },
      { id: 'd', text: 'dbfs:/mnt/azure/container/path', isCorrect: false },
    ],
    explanation: 'The abfss:// (Azure Blob File System Secure) URI scheme connects directly to ADLS Gen2 storage accounts over TLS using native driver optimizations.',
    hints: ['Identify the secure Azure Blob File System (ABFS) protocol prefix.'],
    tags: ['azure', 'adls', 'abfss', 'storage'],
    concepts: ['dbx-azure-adls-abfss'],
  },

  {
    id: 'dbx-storage-repos-12',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'In Azure Databricks, what is the recommended Unity Catalog mechanism for granting clusters secure access to ADLS Gen2 storage without storing client secrets or access keys?',
    options: [
      { id: 'a', text: 'Mount ADLS Gen2 containers into DBFS using hardcoded Storage Account Access Keys inside global init scripts.', isCorrect: false },
      { id: 'b', text: 'Store Azure Key Vault secrets in local driver /tmp plain-text configuration files before running notebook cells.', isCorrect: false },
      { id: 'c', text: 'Create a Unity Catalog Storage Credential using an Azure Access Connector with a User-Assigned Managed Identity.', isCorrect: true },
      { id: 'd', text: 'Set spark.hadoop.fs.azure.account.key as an unencrypted environment variable across shared access mode clusters.', isCorrect: false },
    ],
    explanation: 'Unity Catalog Storage Credentials on Azure utilize Azure Access Connectors coupled with Managed Identities, eliminating the need to embed or manage long-lived storage keys in code.',
    hints: ['Look for Azure Access Connector and Managed Identity integration with Unity Catalog.'],
    tags: ['azure', 'unity-catalog', 'managed-identity', 'security'],
    concepts: ['dbx-azure-managed-identity-uc'],
  },

  {
    id: 'dbx-storage-repos-13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'What cloud storage infrastructure underpins the DBFS root filesystem (dbfs:/) in an Azure Databricks deployment?',
    options: [
      { id: 'a', text: 'Local SSD storage attached directly to driver virtual machine instances.', isCorrect: false },
      { id: 'b', text: 'AWS S3 buckets provisioned in a secondary regional cloud account.', isCorrect: false },
      { id: 'c', text: 'An Azure Storage Account provisioned inside the workspace\'s managed resource group.', isCorrect: true },
      { id: 'd', text: 'On-premises HDFS cluster nodes connected via Azure ExpressRoute.', isCorrect: false },
    ],
    explanation: 'Azure Databricks automatically provisions an Azure Blob Storage account inside the managed resource group during workspace creation to serve as the DBFS root container.',
    hints: ['Identify the Azure Storage Account created in the managed resource group.'],
    tags: ['azure', 'dbfs', 'storage-root'],
    concepts: ['dbx-azure-dbfs-root'],
  },

  {
    id: 'dbx-storage-repos-14',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'A developer uses Python open("/dbfs/mnt/data/file.txt", "r") to read a 10 GB file on a multi-node cluster. Why is this local FUSE mount access discouraged for large datasets compared to spark.read?',
    options: [
      { id: 'a', text: 'FUSE mounts route data through single-threaded driver local disk I/O, bypassing Spark distributed parallel reading across worker executors.', isCorrect: true },
      { id: 'b', text: 'FUSE mounts require manual cluster restarts whenever Delta Lake transaction log files are committed by concurrent writers.', isCorrect: false },
      { id: 'c', text: 'FUSE mounts convert binary files into unencrypted JSON strings before storing them in local browser cookies.', isCorrect: false },
      { id: 'd', text: 'FUSE mounts block Unity Catalog access controls on all non-LTS Databricks Runtime releases running on worker nodes.', isCorrect: false },
    ],
    explanation: 'The local POSIX FUSE mount (/dbfs/...) forces single-threaded file reads on the driver node, bottlenecking performance. Using native Spark DataFrames (dbfs:/ or abfss://) distributes parallel reads across all worker executors.',
    hints: ['Consider single-threaded driver bottleneck vs distributed executor parallel reading.'],
    tags: ['fuse', 'dbfs', 'performance'],
    concepts: ['dbx-fuse-vs-spark-read'],
  },

  {
    id: 'dbx-storage-repos-15',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'Which credential type is required to authenticate Databricks Git Folders (Repos) with Azure DevOps Repositories?',
    options: [
      { id: 'a', text: 'Azure Subscription Owner management certificates stored in DBFS root.', isCorrect: false },
      { id: 'b', text: 'Azure Data Factory pipeline execution tokens generated in Azure Portal.', isCorrect: false },
      { id: 'c', text: 'Storage Account Shared Access Signature (SAS) tokens set in notebooks.', isCorrect: false },
      { id: 'd', text: 'Azure DevOps Personal Access Token (PAT) or Azure AD User Access Token.', isCorrect: true },
    ],
    explanation: 'Databricks Git Folders (Repos) integrate with Azure DevOps using Personal Access Tokens (PAT) or Azure Active Directory (Azure AD) tokens configured in User Settings under Git Integrations.',
    hints: ['Look for Azure DevOps PAT or Azure AD authentication tokens.'],
    tags: ['azure-devops', 'git', 'repos', 'auth'],
    concepts: ['dbx-azure-devops-repos-auth'],
  },

  {
    id: 'dbx-storage-repos-16',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'What is the output of extracting the storage URI scheme from this ADLS Gen2 path?',
    code: `path = "abfss://raw@myadls.dfs.core.windows.net/2026/sales.csv"
protocol = path.split("://")[0]
print(protocol)`,
    expectedOutput: `abfss`,
    explanation: 'The abfss protocol prefix denotes Azure Data Lake Storage Gen2 secure URI endpoints.',
    hints: ['Extract the string before "://".'],
    tags: ['azure', 'adls', 'abfss', 'python'],
    concepts: ['dbx-azure-uri-parsing'],
  },

  {
    id: 'dbx-storage-repos-17',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Rearrange the lines to append a relative module directory to sys.path and import a helper module inside a Databricks Git Repo.',
    correctOrder: [
      `import sys`,
      `import os`,
      `sys.path.append(os.path.abspath("./helpers"))`,
      `import config_loader`,
    ],
    distractorLines: [
      `dbutils.fs.mount("./helpers", "/sys/path")`,
      `import %run ./helpers/config_loader`,
    ],
    solution: `import sys
import os
sys.path.append(os.path.abspath("./helpers"))
import config_loader`,
    explanation: 'Appending relative module directories to Python sys.path allows importing modular Python files in Databricks Git Folders without %run.',
    hints: ['Import sys/os, append path, then import module.'],
    tags: ['repos', 'sys-path', 'python', 'parsons'],
    concepts: ['dbx-repo-python-path'],
  },

  {
    id: 'dbx-storage-repos-18',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Complete the PySpark read statement to load a Delta table from an Azure Data Lake Storage Gen2 container using the ABFSS protocol.',
    template: `df = spark.read.format("delta").load("___://landing@myaccount.dfs.core.windows.net/sales_data")`,
    blanks: ['abfss'],
    solution: `df = spark.read.format("delta").load("abfss://landing@myaccount.dfs.core.windows.net/sales_data")`,
    explanation: 'The abfss protocol URI scheme connects Spark to ADLS Gen2 storage endpoints in Azure.',
    hints: ['Use abfss.'],
    tags: ['azure', 'abfss', 'cloze', 'pyspark'],
    concepts: ['dbx-pyspark-abfss-read'],
  },

  {
    id: 'dbx-storage-repos-19',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to read a Parquet dataset from ADLS Gen2 path "abfss://analytics@mystorage.dfs.core.windows.net/events/year=2026" into DataFrame df.',
    starterCode: `# Load Parquet from ADLS Gen2 path\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'spark.read.format("parquet").load("abfss://analytics@mystorage.dfs.core.windows.net/events/year=2026")',
        description: 'Should load parquet from abfss URI',
      },
    ],
    solution: `df = spark.read.format("parquet").load("abfss://analytics@mystorage.dfs.core.windows.net/events/year=2026")
# OR
df = spark.read.parquet("abfss://analytics@mystorage.dfs.core.windows.net/events/year=2026")`,
    explanation: 'spark.read.format("parquet").load("abfss://...") reads Parquet data directly from ADLS Gen2 storage.',
    hints: ['Use spark.read.format("parquet").load("abfss://...").'],
    tieredHints: {
      apiSignature: 'DataFrameReader.format(source: str).load(path: str) -> DataFrame',
      skeleton: 'df = ____.____.format(____).load(____)',
    },
    tags: ['pyspark', 'adls', 'abfss', 'parquet'],
    concepts: ['dbx-adls-parquet-loading'],
  },

  {
    id: 'dbx-storage-repos-20',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python function configure_adls_credentials(spark_session, storage_account, client_id, secret, tenant_id) that sets Azure Service Principal OAuth 2.0 Spark configurations on spark_session for accessing f"{storage_account}.dfs.core.windows.net". Set OAuth auth type, ClientCredsTokenProvider class, client.id, client.secret, and Microsoft login endpoint.',
    starterCode: `def configure_adls_credentials(spark_session, storage_account, client_id, secret, tenant_id):\n    pass\n`,
    testCases: [
      {
        input: '',
        expectedOutput: '',
        description: 'Should configure ADLS Gen2 Service Principal Spark configs',
      },
    ],
    solution: `def configure_adls_credentials(spark_session, storage_account, client_id, secret, tenant_id):
    host = f"{storage_account}.dfs.core.windows.net"
    spark_session.conf.set(f"fs.azure.account.auth.type.{host}", "OAuth")
    spark_session.conf.set(f"fs.azure.account.oauth.provider.type.{host}", "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider")
    spark_session.conf.set(f"fs.azure.account.oauth2.client.id.{host}", client_id)
    spark_session.conf.set(f"fs.azure.account.oauth2.client.secret.{host}", secret)
    spark_session.conf.set(f"fs.azure.account.oauth2.client.endpoint.{host}", f"https://login.microsoftonline.com/{tenant_id}/oauth2/token")
# OR
def configure_adls_credentials(spark_session, storage_account, client_id, secret, tenant_id):
    conf = spark_session.conf
    h = f"{storage_account}.dfs.core.windows.net"
    conf.set(f"fs.azure.account.auth.type.{h}", "OAuth")
    conf.set(f"fs.azure.account.oauth.provider.type.{h}", "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider")
    conf.set(f"fs.azure.account.oauth2.client.id.{h}", client_id)
    conf.set(f"fs.azure.account.oauth2.client.secret.{h}", secret)
    conf.set(f"fs.azure.account.oauth2.client.endpoint.{h}", f"https://login.microsoftonline.com/{tenant_id}/oauth2/token")`,
    explanation: 'Azure ADLS Gen2 direct access uses fs.azure.account.auth.type and ClientCredsTokenProvider Spark configuration keys mapped to the storage account FQDN.',
    hints: ['Set fs.azure.account.auth.type, provider.type, client.id, client.secret, and endpoint.'],
    tieredHints: {
      apiSignature: 'RuntimeConfig.set(key: str, value: str) -> None',
      skeleton: 'def configure_adls_credentials(spark_session, storage_account, client_id, secret, tenant_id):\n    host = f"{storage_account}.dfs.core.windows.net"\n    spark_session.conf.set(f"fs.azure.account.auth.type.{host}", ____)\n    spark_session.conf.set(f"fs.azure.account.oauth.provider.type.{host}", ____)\n    spark_session.conf.set(____, client_id)\n    spark_session.conf.set(____, secret)\n    spark_session.conf.set(____, f"https://login.microsoftonline.com/{tenant_id}/oauth2/token")',
    },
    tags: ['azure', 'adls', 'oauth', 'spark-config'],
    concepts: ['dbx-azure-adls-service-principal-config'],
  },


  // =========================================================================
  // TOPIC 3: DATABRICKS_NOTEBOOKS_SECURITY (Notebook Mechanics, Secrets & Security)
  // =========================================================================

  {
    id: 'dbx-notebooks-sec-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_NOTEBOOKS_SECURITY,
    language: CodeLanguage.SQL,
    question: 'Complete the notebook magic commands to run a SQL query within a Python notebook and execute a driver shell command.',
    template: `___
SELECT * FROM sales_silver;

___
df -h`,
    blanks: ['%sql', '%sh'],
    solution: `%sql\nSELECT * FROM sales_silver;\n\n%sh\ndf -h`,
    explanation: '%sql switches execution context to Spark SQL engine, while %sh runs shell commands directly on the driver VM OS.',
    hints: ['Use %sql for SQL and %sh for shell.'],
    tags: ['notebooks', 'magic-commands'],
    concepts: ['dbx-magic-commands'],
  },

  {
    id: 'dbx-notebooks-sec-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_NOTEBOOKS_SECURITY,
    question: 'A developer defines a Python variable "total_count = 100" in cell 1. In cell 2, they run "%sql SELECT :total_count". Why does this fail by default?',
    options: [
      { id: 'a', text: 'Execution cells in Databricks notebooks run on completely separate worker instances across distinct virtual machines.', isCorrect: false },
      { id: 'b', text: 'Databricks SQL parser syntax requires all referenced session variables to be pre-registered in Key Vault secret scopes.', isCorrect: false },
      { id: 'c', text: 'Python local variable state is not shared across language magic boundaries without creating a Spark Temp View or widget.', isCorrect: true },
      { id: 'd', text: '%sql cell magic execution blocks exclusively accept Scala variable bindings and reject Python memory object pointers.', isCorrect: false },
    ],
    explanation: 'Each magic command language (%python, %sql, %r) operates in its own interpreter state. To pass data between Python and SQL, use spark.catalog.createOrReplaceTempView() or widgets.',
    hints: ['Consider interpreter state isolation between languages.'],
    tags: ['notebooks', 'magic-commands', 'context'],
    concepts: ['dbx-magic-commands'],
  },

  {
    id: 'dbx-notebooks-sec-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_NOTEBOOKS_SECURITY,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks widget utilities to create a text input widget named "env" with a default value of "dev".',
    starterCode: `# Create text parameter widget\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.widgets.text("env", "dev")',
        description: 'Should create text widget',
      },
    ],
    solution: `dbutils.widgets.text("env", "dev")
# OR
dbutils.widgets.text(name="env", defaultValue="dev")`,
    explanation: 'dbutils.widgets.text(name, defaultValue) creates a text input parameter widget in the notebook UI.',
    hints: ['Use dbutils.widgets.text(name, defaultValue).'],
    tieredHints: {
      apiSignature: 'dbutils.widgets.text(name: str, defaultValue: str, label: str = "") -> None',
      skeleton: '____.widgets.text(____, ____)',
    },
    tags: ['dbutils', 'widgets'],
    concepts: ['dbx-widgets', 'dbx-widgets-params'],
  },

  {
    id: 'dbx-notebooks-sec-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_NOTEBOOKS_SECURITY,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks widget utilities to fetch the current value of widget "env".',
    starterCode: `# Get parameter widget value\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.widgets.get("env")',
        description: 'Should get widget value',
      },
    ],
    solution: `dbutils.widgets.get("env")
# OR
dbutils.widgets.get(name="env")`,
    explanation: 'dbutils.widgets.get(name) retrieves the value passed into a notebook widget.',
    hints: ['Use dbutils.widgets.get(name).'],
    tieredHints: {
      apiSignature: 'dbutils.widgets.get(name: str) -> str',
      skeleton: '____.____.get(____)',
    },
    tags: ['dbutils', 'widgets'],
    concepts: ['dbx-widgets', 'dbx-widgets-params'],
  },

  {
    id: 'dbx-notebooks-sec-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_NOTEBOOKS_SECURITY,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks secret utilities to retrieve secret key "db_pass" from secret scope "prod_scope".',
    starterCode: `# Fetch secret credential\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.secrets.get(scope="prod_scope", key="db_pass")',
        description: 'Should get secret from scope',
      },
    ],
    solution: `dbutils.secrets.get(scope="prod_scope", key="db_pass")
# OR
dbutils.secrets.get("prod_scope", "db_pass")`,
    explanation: 'dbutils.secrets.get(scope, key) fetches decrypted secret credentials at runtime.',
    hints: ['Use dbutils.secrets.get(scope, key).'],
    tieredHints: {
      apiSignature: 'dbutils.secrets.get(scope: str, key: str) -> str',
      skeleton: '____.secrets.get(scope=____, key=____)',
    },
    tags: ['dbutils', 'secrets'],
    concepts: ['dbx-secrets', 'dbx-secret-scopes'],
  },

  {
    id: 'dbx-notebooks-sec-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_NOTEBOOKS_SECURITY,
    question: 'What happens when a notebook prints a string secret fetched via dbutils.secrets.get() using print(secret_val)?',
    options: [
      { id: 'a', text: 'Databricks automatically masks the value and displays [REDACTED] in cell stdout logs.', isCorrect: true },
      { id: 'b', text: 'The secret string is printed in unencrypted cleartext directly into notebook execution logs.', isCorrect: false },
      { id: 'c', text: 'Notebook execution immediately halts and throws a unhandled SecurityException runtime error.', isCorrect: false },
      { id: 'd', text: 'The secret value is automatically exported to an unencrypted text file on DBFS root storage.', isCorrect: false },
    ],
    explanation: 'Databricks secret utility masks retrieved secrets in stdout/stderr outputs with [REDACTED] to prevent accidental key leaks in notebook execution logs.',
    hints: ['Think about automatic output masking mechanisms.'],
    tags: ['secrets', 'redaction', 'security'],
    concepts: ['dbx-secrets', 'dbx-secret-scopes'],
  },

  {
    id: 'dbx-notebooks-sec-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_NOTEBOOKS_SECURITY,
    question: 'An administrator needs to restrict workspace Web UI and REST API traffic so that users can only log in from corporate network IP ranges (e.g. 192.0.2.0/24). Which feature should be configured?',
    options: [
      { id: 'a', text: 'Cluster Policy JSON autoscale configurations.', isCorrect: false },
      { id: 'b', text: 'Unity Catalog GRANT SELECT ON TABLE statements.', isCorrect: false },
      { id: 'c', text: 'Notebook dbutils.fs.mount() extra_configs map.', isCorrect: false },
      { id: 'd', text: 'Workspace IP Access Lists via REST API or CLI.', isCorrect: true },
    ],
    explanation: 'IP Access Lists allow workspace administrators to configure allowlists and blocklists of IP CIDR blocks to restrict Web UI and REST API connections.',
    hints: ['Look for network CIDR restriction tools.'],
    tags: ['security', 'ip-access-lists', 'admin'],
    concepts: ['dbx-platform-security'],
  },

  {
    id: 'dbx-notebooks-sec-8',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_NOTEBOOKS_SECURITY,
    language: CodeLanguage.PYTHON,
    question: 'Arrange the statements to create a dropdown widget named "region", fetch its value, and look up the matching connection secret.',
    correctOrder: [
      'dbutils.widgets.dropdown("region", "US", ["US", "EU", "APAC"])',
      'selected_region = dbutils.widgets.get("region")',
      'conn_key = f"conn_str_{selected_region}"',
      'conn_str = dbutils.secrets.get(scope="cloud_scope", key=conn_key)',
    ],
    distractorLines: [
      'dbutils.fs.head("region", "US")',
    ],
    solution: `dbutils.widgets.dropdown("region", "US", ["US", "EU", "APAC"])\nselected_region = dbutils.widgets.get("region")\nconn_key = f"conn_str_{selected_region}"\nconn_str = dbutils.secrets.get(scope="cloud_scope", key=conn_key)`,
    explanation: 'Combines dynamic widget parameter selection with secret scope lookups for environment-aware configurations.',
    hints: ['Dropdown creation -> get value -> construct key -> secret lookup.'],
    tags: ['widgets', 'secrets', 'pipeline'],
    concepts: ['dbx-widgets-params', 'dbx-secret-scopes'],
  },

  {
    id: 'dbx-notebooks-sec-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_NOTEBOOKS_SECURITY,
    question: 'What is the key advantage of using Azure Key Vault or AWS Secrets Manager-backed secret scopes over Databricks-backed secret scopes?',
    options: [
      { id: 'a', text: 'Key Vault backed secret scopes accelerate Spark DataFrame query performance by bypassing driver memory serialization.', isCorrect: false },
      { id: 'b', text: 'Key Vault backed scopes enable centralized enterprise cloud secret rotation without persisting keys inside Databricks control plane.', isCorrect: true },
      { id: 'c', text: 'Databricks-backed secret scopes exclusively accept Scala string types and reject Python secret string references.', isCorrect: false },
      { id: 'd', text: 'Key Vault backed secret scopes bypass workspace ACL authorization checks and grant workspace-wide read access.', isCorrect: false },
    ],
    explanation: 'Cloud key vault backed secret scopes delegate secret storage and lifecycle rotation to enterprise identity key stores (Azure Key Vault / AWS Secrets Manager).',
    hints: ['Focus on centralized enterprise cloud key management.'],
    tags: ['secrets', 'key-vault', 'security'],
    concepts: ['dbx-secret-scopes'],
  },

  {
    id: 'dbx-notebooks-sec-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_NOTEBOOKS_SECURITY,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks widget utilities to remove widget "env".',
    starterCode: `# Remove parameter widget\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.widgets.remove("env")',
        description: 'Should remove widget',
      },
    ],
    solution: `dbutils.widgets.remove("env")
# OR
dbutils.widgets.remove(name="env")`,
    explanation: 'dbutils.widgets.remove(name) removes a specific parameter widget from the notebook interface.',
    hints: ['Use dbutils.widgets.remove(name).'],
    tieredHints: {
      apiSignature: 'dbutils.widgets.remove(name: str) -> None',
      skeleton: '____.____.remove(____)',
    },
    tags: ['dbutils', 'widgets'],
    concepts: ['dbx-widgets'],
  },
];
