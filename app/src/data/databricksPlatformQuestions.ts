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
    question: 'Databricks keeps a cluster\'s driver on an on-demand VM even when its workers use cheaper spot VMs. Why?',
    options: [
      { id: 'a', text: 'Spot VMs are reclaimed together, so evicting any worker would also take a spot driver with it.', isCorrect: false },
      { id: 'b', text: 'The driver runs no Spark tasks, so a spot discount would save nothing on that one machine.', isCorrect: false },
      { id: 'c', text: 'If a spot driver is reclaimed, the whole cluster goes down and its running jobs fail.', isCorrect: true },
      { id: 'd', text: 'A lost spot driver only pauses the job until a new driver resumes it from the last finished stage.', isCorrect: false },
    ],
    explanation: 'The driver runs the notebook code and plans every job, so losing it ends the Spark application: the cluster goes down and its running jobs fail, with no resume from where they were. A reclaimed worker only loses its tasks, which Spark re-runs on the others while Databricks replaces the worker. So workers can be spot, often with an on-demand fallback, while the driver stays on-demand. Spot VMs are reclaimed one by one, and the driver is a full-price VM like any other.',
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
      { id: 'a', text: 'No isolation shared', isCorrect: false },
      { id: 'b', text: 'Dedicated (formerly Single user)', isCorrect: false },
      { id: 'c', text: 'Standard (formerly Shared)', isCorrect: true },
      { id: 'd', text: 'Custom (legacy cluster settings)', isCorrect: false },
    ],
    explanation: 'Standard access mode, called Shared until it was renamed, lets many users run code on one cluster with Unity Catalog permissions checked per user and each user\'s code isolated from the others. Dedicated (formerly Single user) serves one user or one group, and No isolation shared is a legacy mode with no Unity Catalog and no isolation between users. Custom is only how the UI shows legacy settings, not a mode to choose.',
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
      { id: 'a', text: 'Set spark.dynamicAllocation.maxExecutors to 8 in each cluster\'s Spark config.', isCorrect: false },
      { id: 'b', text: 'Revoke CAN ATTACH TO privileges on all workspace directories.', isCorrect: false },
      { id: 'c', text: 'Set a default autoscaling maximum of 8 in the workspace admin settings.', isCorrect: false },
      { id: 'd', text: 'Give developers a cluster policy that caps autoscale.max_workers and fixes the workers\' availability to spot.', isCorrect: true },
    ],
    explanation: 'A cluster policy is a set of rules, in JSON, on the settings of any cluster created under it: here a range rule with maxValue 8 on autoscale.max_workers and a fixed rule on the cloud availability attribute (for example aws_attributes.availability). Users who may only create clusters through the policy cannot go past it. A Spark config setting is chosen by whoever creates the cluster, so it limits nothing; there is no workspace-wide autoscaling maximum, and CAN ATTACH TO only controls who may use an existing cluster.',
    hints: ['Which feature limits the settings anyone can choose when creating a cluster?'],
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
    question: 'This cluster spec is a Python dict in the shape the Clusters API takes. Fill in the two missing key names so that the cluster keeps between 1 and 8 workers and stops itself after 30 idle minutes.',
    template: `spec = {
    "spark_version": "15.4.x-scala2.12",
    "autoscale": {"min_workers": 1, "___": 8},
    "___": 30,
}`,
    blanks: ['max_workers', 'autotermination_minutes'],
    solution: `spec = {
    "spark_version": "15.4.x-scala2.12",
    "autoscale": {"min_workers": 1, "max_workers": 8},
    "autotermination_minutes": 30,
}`,
    explanation: 'Autoscaling keeps the worker count between min_workers and max_workers, adding workers under load and removing them when idle. autotermination_minutes stops an all-purpose cluster after that many idle minutes, so nobody pays for it overnight. Both are plain keys of the cluster spec, as a cluster policy, the Clusters API or a job\'s new_cluster take it.',
    hints: ['The autoscale block has a minimum and a maximum.', 'The second key is about stopping automatically after idle minutes.'],
    tags: ['clusters', 'autoscaling', 'auto-termination', 'cloze'],
    concepts: ['dbx-cluster-config'],
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
    concepts: ['dbx-runtime-selection'],
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
      { id: 'd', text: 'Photon turns Python UDFs into vectorized C++, so row-by-row Python code speeds up too.', isCorrect: false },
    ],
    explanation: 'Photon is Databricks\' native vectorized query engine, written in C++, that runs SQL and DataFrame operators faster with no code changes. Python UDFs and RDD code are not translated: they still run on plain Spark. Photon still needs a driver and still shuffles data between nodes.',
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
      { id: 'a', text: 'LTS releases always ship the newest Apache Spark version, so production pipelines get every new feature and optimization first.', isCorrect: false },
      { id: 'b', text: 'LTS releases are the only Databricks Runtime versions that can run on Unity Catalog compute with the Photon engine enabled.', isCorrect: false },
      { id: 'c', text: 'LTS releases guarantee 3 years of full support, bug fixes, and security patches without introducing breaking API changes across pipeline runs.', isCorrect: true },
      { id: 'd', text: 'LTS releases allow mixing different Apache Spark minor versions across worker nodes within the same cluster during rolling cluster upgrades.', isCorrect: false },
    ],
    explanation: 'LTS releases are supported for 3 years, offering a stable environment with critical security updates and bug fixes without breaking changes, making them ideal for mission-critical production pipelines.',
    hints: ['Think about support lifecycle duration and enterprise stability.'],
    tags: ['clusters', 'databricks-runtime', 'lts'],
    concepts: ['dbx-runtime-selection'],
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
    concepts: ['dbx-architecture'],
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
      { id: 'c', text: 'A cluster-named folder under dbfs:/databricks/init/, which runs automatically on that cluster without being listed in its config.', isCorrect: false },
      { id: 'd', text: 'A %sh cell at the top of the notebook, which runs the same shell commands on every node before the notebook\'s other cells.', isCorrect: false },
    ],
    explanation: 'Databricks recommends keeping init scripts as workspace files or in a Unity Catalog volume (/Volumes/...), where workspace permissions or Unity Catalog grants decide who may change them. Scripts in DBFS, including the legacy cluster-named folders under dbfs:/databricks/init/, are end-of-life. A %sh cell runs only on the driver, and only when the notebook runs, so it is no substitute for an init script.',
    hints: ['Look for secure storage mechanisms backed by Unity Catalog or workspace permissions.'],
    tags: ['clusters', 'init-scripts', 'security'],
    concepts: ['dbx-init-scripts'],
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
    concepts: ['dbx-runtime-selection'],
  },

  {
    id: 'dbx-compute-admin-15',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'On an all-purpose cluster in Standard access mode (formerly Shared), a notebook cell that calls `spark.sparkContext.parallelize(range(10))` to build an RDD fails, while DataFrame and SQL cells work. Why?',
    options: [
      { id: 'a', text: 'RDD code runs only with Photon disabled, and Standard access mode always turns Photon on.', isCorrect: false },
      { id: 'b', text: 'RDD code needs Databricks Runtime for Machine Learning, which Standard access mode cannot run.', isCorrect: false },
      { id: 'c', text: 'Standard access mode isolates each user\'s code and does not support RDD APIs; use DataFrames, or Dedicated access mode for RDD code.', isCorrect: true },
      { id: 'd', text: 'Standard access mode runs only Python and SQL, so any JVM-based API, Scala included, is refused.', isCorrect: false },
    ],
    explanation: 'Standard access mode lets many users share a cluster under Unity Catalog by isolating each user\'s code from the others, and to keep that isolation it does not support RDD APIs. DataFrame and SQL code works, and code that really needs RDDs runs on Dedicated access mode (formerly Single user). Scala, once limited to single-user clusters, is supported on Standard access mode since Databricks Runtime 13.3 LTS. Photon does not change which APIs are allowed; RDD code simply runs on plain Spark.',
    hints: ['What does a cluster shared by many users have to keep apart?'],
    tags: ['clusters', 'access-modes', 'scala'],
    concepts: ['dbx-access-modes'],
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
    concepts: ['dbx-runtime-selection'],
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
      { id: 'd', text: 'Serverless SQL Warehouses start in seconds instead of minutes, and Databricks manages the compute they run on.', isCorrect: true },
    ],
    explanation: 'Serverless SQL Warehouses run compute in Databricks-managed cloud accounts, providing instant startup (seconds vs minutes) and automatic resource management without cluster warm-up delays.',
    hints: ['Think about instant start times and serverless compute elasticity.'],
    tags: ['sql-warehouses', 'serverless', 'compute'],
    concepts: ['dbx-sql-warehouses'],
  },

  {
    id: 'dbx-compute-admin-18',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'A Databricks SQL Warehouse experiences high query concurrency during peak hours, causing queries to queue up. How should the administrator configure the warehouse to handle concurrent users without increasing single-query latency?',
    options: [
      { id: 'a', text: 'Raise the warehouse\'s cluster size (for example Small to Large), so each query gets more cores to finish faster.', isCorrect: false },
      { id: 'b', text: 'Increase the minimum and maximum cluster scaling limits to enable multi-cluster auto-scaling for concurrent query execution.', isCorrect: true },
      { id: 'c', text: 'Increase spark.sql.shuffle.partitions to 2000 in global cluster init scripts across all workspace nodes.', isCorrect: false },
      { id: 'd', text: 'Turn on the query result cache, so queued queries are answered from earlier results instead of waiting.', isCorrect: false },
    ],
    explanation: 'Queueing means too many queries at once, so the fix is more clusters behind the warehouse: raising the maximum cluster count lets it scale out and run the queued queries in parallel. A larger cluster size makes each query faster (scale up) but is the lever for latency, not concurrency. The result cache only helps when exactly the same query is repeated over unchanged data, and shuffle partitions do not add capacity.',
    hints: ['Distinguish between scaling out for concurrency vs scaling up for query speed.'],
    tags: ['sql-warehouses', 'auto-scaling', 'concurrency'],
    concepts: ['dbx-sql-warehouses'],
  },

  {
    id: 'dbx-compute-admin-19',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'An admin wants a cluster policy that forces every cluster created under it to use Databricks Runtime 15.4.x-scala2.12 and caps autoscaling at 4 workers. Which policy JSON does that?',
    options: [
      { id: 'a', text: '{"spark_version": {"type": "allowlist", "values": ["15.4.x-scala2.12", "16.4.x-scala2.12"]}, "autoscale.max_workers": {"type": "range", "maxValue": 4}}', isCorrect: false },
      { id: 'b', text: '{"spark_version": {"type": "unlimited", "defaultValue": "15.4.x-scala2.12"}, "autoscale.max_workers": {"type": "range", "maxValue": 4}}', isCorrect: false },
      { id: 'c', text: '{"spark_version": {"type": "fixed", "value": "15.4.x-scala2.12"}, "autoscale.max_workers": {"type": "range", "maxValue": 4}}', isCorrect: true },
      { id: 'd', text: '{"spark_version": {"type": "fixed", "value": "15.4.x-scala2.12"}, "autoscale.max_workers": {"type": "max", "value": 4}}', isCorrect: false },
    ],
    explanation: 'A "fixed" rule locks an attribute to its value, so every cluster under the policy runs 15.4.x-scala2.12. A "range" rule bounds a number, and maxValue 4 caps autoscale.max_workers. An allowlist of two versions still lets users pick 16.4, and "unlimited" with a defaultValue only pre-fills the field. There is no "max" rule type: the rule types are fixed, forbidden, allowlist, blocklist, regex, range and unlimited.',
    hints: ['Look for valid Databricks Cluster Policy JSON rule types.'],
    tags: ['cluster-policies', 'json', 'governance'],
    concepts: ['dbx-cluster-policies'],
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
    concepts: ['dbx-cluster-config'],
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
    explanation: 'Global init scripts are managed by workspace admins in the admin settings, and they run on every classic cluster in the workspace, all-purpose and job compute alike, so one bad script can stop every cluster from starting. They do not run on serverless compute or SQL warehouses, which take no init scripts.',
    hints: ['Identify the highest workspace administrative tier and global scope.'],
    tags: ['init-scripts', 'global', 'admin'],
    concepts: ['dbx-init-scripts'],
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
    concepts: ['dbx-runtime-selection'],
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
    concepts: ['dbx-cluster-config'],
  },

  {
    id: 'dbx-compute-admin-24',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'How does Databricks handle a cloud provider Spot instance eviction notification (2-minute warning) on a worker node in an auto-scaling cluster?',
    options: [
      { id: 'a', text: 'It immediately terminates all running jobs on the cluster and triggers a cold restart of the driver node.', isCorrect: false },
      { id: 'b', text: 'The worker\'s lost tasks are re-run on the other workers, and Databricks requests a replacement worker, on-demand if a fallback is set.', isCorrect: true },
      { id: 'c', text: 'It automatically converts the entire cluster into a Serverless SQL Warehouse without interrupting active Spark tasks.', isCorrect: false },
      { id: 'd', text: 'It ignores the cloud provider notification and allows worker node disk volumes to corrupt active Delta log files.', isCorrect: false },
    ],
    explanation: 'Losing a worker is something Spark is built for: the tasks and shuffle output that lived on it are recomputed on the remaining workers, and Databricks asks the cloud for a replacement, falling back to an on-demand VM if the cluster is set up that way. The job slows down but keeps running. With decommissioning turned on in the Spark config, Spark can also use the eviction warning to stop scheduling on that worker and copy its shuffle and cached data away first. Only losing the driver would end the job.',
    hints: ['What does Spark do with the tasks of a worker it has lost?'],
    tags: ['clusters', 'spot-eviction', 'resilience'],
    concepts: ['dbx-spot-on-demand'],
  },

  {
    id: 'dbx-compute-admin-25',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'How do Databricks Instance Pools reduce cluster startup time and execution costs for frequent job runs?',
    options: [
      { id: 'a', text: 'Idle pool instances cost nothing, because the cloud provider bills a VM only while a cluster is using it.', isCorrect: false },
      { id: 'b', text: 'Pools keep one cluster running between jobs, so each new job reuses the previous job\'s Spark session and cache.', isCorrect: false },
      { id: 'c', text: 'Pools pre-install every cluster library ahead of time, so job clusters skip library installation at startup.', isCorrect: false },
      { id: 'd', text: 'Pools maintain a set of idle, pre-provisioned cloud VM instances ready to attach to clusters without cloud allocation delays.', isCorrect: true },
    ],
    explanation: 'An instance pool keeps idle cloud VMs ready, so a cluster that starts or scales up takes VMs from the pool instead of waiting minutes for the cloud to provision them. Idle pool VMs charge no Databricks DBUs but still cost their cloud VM price. Each cluster still starts its own Spark session and installs its own libraries; only the VM wait is saved.',
    hints: ['Think about warm pre-allocated VM instances.'],
    tags: ['clusters', 'instance-pools', 'performance'],
    concepts: ['dbx-cluster-config'],
  },

  {
    id: 'dbx-compute-admin-26',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    question: 'An administrator needs to inspect stdout/stderr logs from a cluster-scoped init script that failed during node provisioning. Where can these logs be retrieved?',
    options: [
      { id: 'a', text: 'Printed directly in the workspace notifications banner on the Databricks SQL landing page after cluster failure.', isCorrect: false },
      { id: 'b', text: 'In the cluster log delivery destination set under Advanced Options, in the <cluster-id>/init_scripts folder.', isCorrect: true },
      { id: 'c', text: 'Saved in Unity Catalog system tables under system.access.audit_logs as encrypted binary string payloads.', isCorrect: false },
      { id: 'd', text: 'In the Spark UI\'s driver stdout tab, since init scripts run inside the Spark driver process at startup.', isCorrect: false },
    ],
    explanation: 'With cluster log delivery set (Advanced Options, Logging), each init script\'s stdout and stderr land in the destination under <cluster-id>/init_scripts, one subfolder per node. Init scripts run on each node before Spark starts, so the Spark UI never shows their output, and the audit log records actions, not script output.',
    hints: ['Look for Cluster Log Delivery configuration under Advanced Options.'],
    tags: ['init-scripts', 'logging', 'troubleshooting'],
    concepts: ['dbx-cluster-config'],
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
    concepts: ['dbx-driver-worker-sizing'],
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
    concepts: ['dbx-access-modes'],
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
    concepts: ['dbx-cluster-config'],
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
    concepts: ['dbx-cluster-config'],
  },

  {
    id: 'dbx-compute-admin-31',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'This plain Python models how a cluster policy checks a cluster request: a "fixed" rule must equal its value, and a "range" rule may not go above its maxValue. What does it print? The answer is one line: two words separated by a space.',
    code: `policy = {
    "spark_version": {"type": "fixed", "value": "15.4.x-scala2.12"},
    "autoscale.max_workers": {"type": "range", "maxValue": 8},
}
request = {"spark_version": "15.4.x-scala2.12", "autoscale.max_workers": 16}
ok_version = request["spark_version"] == policy["spark_version"]["value"]
ok_workers = request["autoscale.max_workers"] <= policy["autoscale.max_workers"]["maxValue"]
print(ok_version, ok_workers)`,
    expectedOutput: `True False`,
    explanation: 'The requested runtime equals the fixed value, so the first check is True, but 16 workers is above the range rule\'s maxValue of 8, so the second is False, and Databricks would refuse to create this cluster under the policy. Real policies use exactly these rule shapes: {"type": "fixed", "value": ...} to lock a setting and {"type": "range", "maxValue": ...} to cap a number.',
    hints: ['Compare each requested value with its rule.', 'print with two arguments puts a space between them.'],
    tags: ['cluster-policies', 'validation', 'python'],
    concepts: ['dbx-cluster-policies'],
  },

  {
    id: 'dbx-compute-admin-32',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'The dict below stands in for a notebook\'s context tags, which name the user and the cluster a notebook runs on. What does this cell print? The answer is one line.',
    code: `context_tags = {"user": "analyst@company.com", "clusterId": "1005-120000-abcd123"}
user_email = context_tags.get("user", "unknown")
cluster_id = context_tags.get("clusterId", "unknown")
print(f"{user_email}:{cluster_id}")`,
    expectedOutput: `analyst@company.com:1005-120000-abcd123`,
    explanation: 'Both keys exist, so dict.get returns their values and the defaults ("unknown") are not used. The f-string joins the two values with a colon: analyst@company.com:1005-120000-abcd123. Real context tags carry the same kind of facts, such as the user and a cluster ID like 1005-120000-abcd123.',
    hints: ['dict.get returns the default only when the key is missing.', 'The f-string puts a colon between the two values.'],
    tags: ['dbutils', 'context', 'tags'],
    concepts: ['dbx-utilities'],
  },

  {
    id: 'dbx-compute-admin-33',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'Rearrange the lines into a cluster policy definition (JSON) that locks spark_version to "15.4.x-scala2.12" and caps autoscale.max_workers at 8. Put the spark_version rule first.',
    correctOrder: [
      `{`,
      `  "spark_version": {"type": "fixed", "value": "15.4.x-scala2.12"},`,
      `  "autoscale.max_workers": {"type": "range", "maxValue": 8}`,
      `}`,
    ],
    distractorLines: [
      `  "spark_version": {"type": "unlimited", "defaultValue": "15.4.x-scala2.12"},`,
      `  "autoscale.max_workers": {"type": "max", "value": 8}`,
    ],
    solution: `{
  "spark_version": {"type": "fixed", "value": "15.4.x-scala2.12"},
  "autoscale.max_workers": {"type": "range", "maxValue": 8}
}`,
    explanation: 'A "fixed" rule locks an attribute to its value, while "unlimited" with a defaultValue only pre-fills it and lets the user change it. A "range" rule bounds a number, and its maxValue is the cap. There is no "max" rule type: the types are fixed, forbidden, allowlist, blocklist, regex, range and unlimited.',
    hints: ['Locking a value and suggesting a default are different rules.', 'A numeric cap is the upper end of a range.'],
    tags: ['cluster-policies', 'json', 'parsons'],
    concepts: ['dbx-cluster-policies'],
  },

  {
    id: 'dbx-compute-admin-34',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'Rearrange the lines to construct a Python script that creates a cluster init shell script in a Unity Catalog Volume using dbutils.fs.put. Assign the volume path first, then the script content, then write the file.',
    correctOrder: [
      `volume_path = "/Volumes/main/default/scripts/env_setup.sh"`,
      `script_content = "#!/bin/bash\\napt-get update && apt-get install -y curl\\n"`,
      `dbutils.fs.put(volume_path, script_content, overwrite=True)`,
    ],
    distractorLines: [
      `dbutils.fs.put(volume_path, script_content, force=True)`,
      `dbutils.fs.write(volume_path, script_content, overwrite=True)`,
    ],
    solution: `volume_path = "/Volumes/main/default/scripts/env_setup.sh"
script_content = "#!/bin/bash\\napt-get update && apt-get install -y curl\\n"
dbutils.fs.put(volume_path, script_content, overwrite=True)`,
    explanation: 'dbutils.fs.put writes file contents to path destinations in Unity Catalog Volumes or DBFS. The overwrite=True parameter enables replacing existing files.',
    hints: ['dbutils.fs has no write method; check the name of the argument that replaces an existing file.'],
    tags: ['init-scripts', 'dbutils', 'volumes'],
    concepts: ['dbx-init-scripts'],
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
    hints: ['The dbutils.fs method that writes a string to a file.', 'overwrite takes a Python boolean.'],
    tags: ['dbutils', 'fs', 'cloze'],
    concepts: ['dbx-utilities'],
  },

  {
    id: 'dbx-compute-admin-36',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'This cluster spec is a Python dict in the shape the Clusters API takes. Fill in the two missing values so that several users can share the cluster under Unity Catalog permissions (Standard access mode) and its SQL and DataFrame work runs on the Photon engine.',
    template: `spec = {
    "spark_version": "15.4.x-scala2.12",
    "data_security_mode": "___",
    "runtime_engine": "___",
}`,
    blanks: ['USER_ISOLATION', 'PHOTON'],
    blankAlternates: [['DATA_SECURITY_MODE_STANDARD'], []],
    solution: `spec = {
    "spark_version": "15.4.x-scala2.12",
    "data_security_mode": "USER_ISOLATION",
    "runtime_engine": "PHOTON",
}`,
    explanation: 'In the Clusters API, Standard access mode (formerly Shared) is data_security_mode "USER_ISOLATION" (newer API versions also accept "DATA_SECURITY_MODE_STANDARD"), and Dedicated (formerly Single user) is "SINGLE_USER". runtime_engine "PHOTON" turns on the Photon engine; "STANDARD" leaves it off. Photon speeds up SQL and DataFrame work, while Python UDFs still run on plain Spark.',
    hints: ['The API name of Standard access mode describes how it keeps users apart.', 'The engine is named in capitals.'],
    tags: ['clusters', 'access-mode', 'photon', 'cloze'],
    concepts: ['dbx-access-modes', 'dbx-cluster-config'],
  },

  {
    id: 'dbx-compute-admin-38',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_COMPUTE_ADMIN,
    language: CodeLanguage.PYTHON,
    question: 'Complete the cluster policy definition so that the runtime is locked to 15.4.x-scala2.12 and autoscaling is capped at 8 workers. Each blank is a policy rule type.',
    template: `policy = {\n    "spark_version": {"type": "___", "value": "15.4.x-scala2.12"},\n    "autoscale.max_workers": {"type": "___", "maxValue": 8}\n}`,
    blanks: ['fixed', 'range'],
    solution: `policy = {\n    "spark_version": {"type": "fixed", "value": "15.4.x-scala2.12"},\n    "autoscale.max_workers": {"type": "range", "maxValue": 8}\n}`,
    explanation: 'A "fixed" rule locks an attribute to its value, and a "range" rule bounds a number between an optional minValue and maxValue, so maxValue 8 caps the workers. There is no "max" rule type; the types are fixed, forbidden, allowlist, blocklist, regex, range and unlimited.',
    hints: ['One rule type locks a value.', 'The rule that takes minValue and maxValue.'],
    tags: ['cluster-policies', 'json', 'cloze'],
    concepts: ['dbx-cluster-policies'],
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
    question: 'Write a Python statement using Databricks filesystem utilities (dbutils.fs) to copy the file "/Volumes/main/sales/raw/sales.csv" to "/Volumes/main/sales/archive/sales.csv", keeping the original.',
    starterCode: `# Copy file\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.fs.cp("/Volumes/main/sales/raw/sales.csv", "/Volumes/main/sales/archive/sales.csv")',
        description: 'Should copy file',
      },
    ],
    requires: [/\.cp\s*\(/],
    solution: `dbutils.fs.cp("/Volumes/main/sales/raw/sales.csv", "/Volumes/main/sales/archive/sales.csv")
# OR
dbutils.fs.cp(from_path="/Volumes/main/sales/raw/sales.csv", to_path="/Volumes/main/sales/archive/sales.csv")`,
    explanation: 'dbutils.fs.cp(from, to) copies a file, and with recurse=True a whole folder; the source stays where it was, unlike dbutils.fs.mv. It works on Unity Catalog volume paths (/Volumes/...), on cloud URIs you may read and write, and on legacy DBFS paths. You need READ VOLUME on the source volume and WRITE VOLUME on the target.',
    hints: ['Use dbutils.fs.cp(src, dst).'],
    tieredHints: {
      apiSignature: 'dbutils.fs.cp(from: str, to: str, recurse: bool = False) -> bool',
      skeleton: '____.____.cp(____, "/Volumes/main/sales/archive/sales.csv")',
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
    question: 'Write a Python statement using Databricks filesystem utilities (dbutils.fs) to delete the folder "/Volumes/main/default/scratch/run_42/" together with everything inside it.',
    starterCode: `# Remove directory recursively\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.fs.rm("/Volumes/main/default/scratch/run_42/", True)',
        description: 'Should remove directory recursively',
      },
    ],
    requires: [/True/],
    solution: `dbutils.fs.rm("/Volumes/main/default/scratch/run_42/", True)
# OR
dbutils.fs.rm("/Volumes/main/default/scratch/run_42/", recurse=True)`,
    explanation: 'dbutils.fs.rm(path, recurse=True) deletes a folder and everything in it; without recurse=True it removes only a single file or an empty folder. The deletion is permanent, so check the path first.',
    hints: ['Pass True or recurse=True as the second argument.'],
    tieredHints: {
      apiSignature: 'dbutils.fs.rm(dir: str, recurse: bool = False) -> bool',
      skeleton: '____.____.rm(____, ____)',
    },
    tags: ['dbutils', 'fs', 'rm'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

  {
    id: 'dbx-storage-repos-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'A notebook in a Databricks Git folder (formerly Repos) needs a helper function from the file "helpers/utils.py" in the same repository. What is the recommended way to use it?',
    options: [
      { id: 'a', text: 'Import it with plain Python, "from helpers.utils import my_func", since the Git folder root is on sys.path.', isCorrect: true },
      { id: 'b', text: 'Execute "%run ./helpers/utils.py" in a preceding cell to inject helper declarations into notebook scope.', isCorrect: false },
      { id: 'c', text: 'Compile "utils.py" into a shared wheel library artifact and attach it to the cluster via workspace libraries.', isCorrect: false },
      { id: 'd', text: 'Fetch "utils.py" onto local driver disk under "file:/tmp" using driver shell commands before execution.', isCorrect: false },
    ],
    explanation: 'A Git folder puts the repository root on sys.path, so a notebook anywhere in it can import the repository\'s .py files as modules, as in any Python project. %run is for running another notebook in this one\'s scope, and it pours all of that notebook\'s names into this one. A wheel or a copy on local disk works but is extra machinery the Git folder makes unnecessary.',
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
    explanation: 'The driver\'s local disk (file:/tmp and the like) belongs to its VM, and the VM is released when the cluster stops, so whatever was written there is gone; workers\' local disks behave the same. Keep anything that must last in a Unity Catalog volume or table, which live in cloud object storage.',
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
    question: 'Arrange the lines to create the folder "archive" in the volume /Volumes/main/ops/landing, then move the file raw.json from the volume into that folder, using Databricks filesystem utilities.',
    correctOrder: [
      'dbutils.fs.mkdirs("/Volumes/main/ops/landing/archive")',
      'dbutils.fs.mv("/Volumes/main/ops/landing/raw.json", "/Volumes/main/ops/landing/archive/raw.json")',
    ],
    distractorLines: [
      'dbutils.fs.mkdirs("/Volumes/main/ops/landing/archive/raw.json")',
    ],
    solution: `dbutils.fs.mkdirs("/Volumes/main/ops/landing/archive")\ndbutils.fs.mv("/Volumes/main/ops/landing/raw.json", "/Volumes/main/ops/landing/archive/raw.json")`,
    explanation: 'dbutils.fs.mkdirs takes the folder\'s path and creates it, with any missing parents, and dbutils.fs.mv then moves the file into it under its full new path. Calling mkdirs with the file\'s target path would create a folder named raw.json, so the move would put the file inside that folder instead.',
    hints: ['mkdirs takes the path of the folder, not of the file.'],
    tags: ['dbutils', 'fs', 'mv'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

  {
    id: 'dbx-storage-repos-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'How does a Databricks Git folder (formerly Repos) sign in to a remote Git provider such as GitHub or Azure DevOps?',
    options: [
      { id: 'a', text: 'Plaintext Databricks workspace user passwords saved to DBFS root.', isCorrect: false },
      { id: 'b', text: 'Anonymous HTTP unauthenticated public cloning protocols exclusively.', isCorrect: false },
      { id: 'c', text: 'Root cloud provider IAM secret access keys attached to cluster roles.', isCorrect: false },
      { id: 'd', text: 'A Git provider personal access token, or the Databricks GitHub App, linked in User Settings.', isCorrect: true },
    ],
    explanation: 'A Git folder signs in over HTTPS with credentials linked under User Settings, Linked accounts: a personal access token from the Git provider, or for GitHub the Databricks GitHub App (OAuth). SSH keys are not supported, and neither the workspace password nor a cloud IAM key is a Git credential.',
    hints: ['Which credential does a Git provider issue for HTTPS access?'],
    tags: ['repos', 'git', 'auth'],
    concepts: ['dbx-repos'],
  },

  {
    id: 'dbx-storage-repos-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities (dbutils.fs) that returns the first 500 bytes of the file "/Volumes/main/ops/logs/app.log" as a string.',
    starterCode: `# Read head bytes of file\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.fs.head("/Volumes/main/ops/logs/app.log", 500)',
        description: 'Should read file head',
      },
    ],
    solution: `dbutils.fs.head("/Volumes/main/ops/logs/app.log", 500)
# OR
dbutils.fs.head("/Volumes/main/ops/logs/app.log", maxBytes=500)`,
    explanation: 'dbutils.fs.head(path, maxBytes) reads up to maxBytes from the specified file as a string.',
    hints: ['Use dbutils.fs.head(path, maxBytes).'],
    tieredHints: {
      apiSignature: 'dbutils.fs.head(file: str, maxBytes: int = 65536) -> str',
      skeleton: '____.____.head(____, ____)',
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
      { id: 'b', text: 'Execute SQL: GRANT SELECT ON VOLUME finance.raw.statements TO `analysts`.', isCorrect: false },
      { id: 'c', text: 'Execute SQL: GRANT SELECT ON ANY FILE TO `analysts`, the privilege for reading files by path.', isCorrect: false },
      { id: 'd', text: 'Give `analysts` the CAN READ permission on the folder in the workspace file browser.', isCorrect: false },
    ],
    explanation: 'A volume is a Unity Catalog object named catalog.schema.volume, and reading its files takes the READ VOLUME privilege (WRITE VOLUME to add or change them), granted in SQL. SELECT is the privilege for tables and views, not volumes; ANY FILE belongs to the legacy Hive metastore table ACLs; and workspace folder permissions cover notebooks and workspace files, not volumes. The group also needs USE CATALOG on finance and USE SCHEMA on finance.raw.',
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
    concepts: ['dbx-adls-access'],
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
      { id: 'c', text: 'Create a Unity Catalog storage credential from an Azure Databricks access connector, which uses a managed identity.', isCorrect: true },
      { id: 'd', text: 'Set spark.hadoop.fs.azure.account.key as an unencrypted environment variable across shared access mode clusters.', isCorrect: false },
    ],
    explanation: 'On Azure, a Unity Catalog storage credential wraps an Azure Databricks access connector, whose managed identity (system-assigned or user-assigned) is given a role on the storage account. There is no key or client secret to store or rotate, and an external location built on the credential decides who may reach which path. Keys in init scripts, files or environment variables are readable by anyone who can run code on that compute.',
    hints: ['Look for Azure Access Connector and Managed Identity integration with Unity Catalog.'],
    tags: ['azure', 'unity-catalog', 'managed-identity', 'security'],
    concepts: ['dbx-adls-access'],
  },

  {
    id: 'dbx-storage-repos-13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'In an Azure Databricks workspace, what storage lies behind the legacy DBFS root (dbfs:/)?',
    options: [
      { id: 'a', text: 'Local SSD storage attached directly to driver virtual machine instances.', isCorrect: false },
      { id: 'b', text: 'AWS S3 buckets provisioned in a secondary regional cloud account.', isCorrect: false },
      { id: 'c', text: 'An Azure Storage Account provisioned inside the workspace\'s managed resource group.', isCorrect: true },
      { id: 'd', text: 'On-premises HDFS cluster nodes connected via Azure ExpressRoute.', isCorrect: false },
    ],
    explanation: 'When a workspace is created, Azure Databricks provisions a storage account in the workspace\'s managed resource group, and the DBFS root is a container in it. It is legacy storage that every user of the workspace can reach, so Databricks advises against keeping data there; on Unity Catalog, data goes in managed or external tables and volumes instead.',
    hints: ['Identify the Azure Storage Account created in the managed resource group.'],
    tags: ['azure', 'dbfs', 'storage-root'],
    concepts: ['dbx-dbfs'],
  },

  {
    id: 'dbx-storage-repos-14',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'On a multi-node cluster, a developer reads a 10 GB file with Python, open("/Volumes/main/raw/files/events.json"), and loops over its lines. Why is spark.read the better choice for a file this size?',
    options: [
      { id: 'a', text: 'Python open() runs in one process on the driver, so all 10 GB streams through that one machine while the workers sit idle.', isCorrect: true },
      { id: 'b', text: 'Python open() skips Unity Catalog permission checks, so Standard access mode blocks it for volume paths.', isCorrect: false },
      { id: 'c', text: 'Python open() reads a copy cached on the driver\'s local disk, which can be hours older than the file in storage.', isCorrect: false },
      { id: 'd', text: 'Python open() runs on every worker at once, so each worker processes its own full copy of the 10 GB.', isCorrect: false },
    ],
    explanation: 'A volume path also works as a local path on the cluster, so plain Python can open it, but plain Python runs on the driver alone: the whole file passes through one process on one machine. spark.read splits the file into tasks that the workers read in parallel. The volume path is still checked against your Unity Catalog grants, and Python reads the current file, not a cached copy. Plain Python is fine for small files such as configs.',
    hints: ['Where does plain Python code in a notebook run?'],
    tags: ['fuse', 'dbfs', 'performance'],
    concepts: ['dbx-dbfs-mounts-vs-volumes'],
  },

  {
    id: 'dbx-storage-repos-15',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    question: 'Which credential can a Databricks Git folder (formerly Repos) use to sign in to an Azure DevOps repository?',
    options: [
      { id: 'a', text: 'Azure Subscription Owner management certificates stored in DBFS root.', isCorrect: false },
      { id: 'b', text: 'Azure Data Factory pipeline execution tokens generated in Azure Portal.', isCorrect: false },
      { id: 'c', text: 'Storage Account Shared Access Signature (SAS) tokens set in notebooks.', isCorrect: false },
      { id: 'd', text: 'An Azure DevOps personal access token, or the user\'s Microsoft Entra ID (formerly Azure AD) sign-in.', isCorrect: true },
    ],
    explanation: 'For Azure DevOps, a Git folder signs in with an Azure DevOps personal access token linked in User Settings, or with the user\'s Microsoft Entra ID (formerly Azure AD) identity when the workspace and the DevOps organization share a tenant. Storage SAS tokens, management certificates and Data Factory tokens grant access to other Azure services, not to Git.',
    hints: ['Which credential does Azure DevOps itself issue for Git access?'],
    tags: ['azure-devops', 'git', 'repos', 'auth'],
    concepts: ['dbx-repos'],
  },

  {
    id: 'dbx-storage-repos-16',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'What does this cell print? The answer is one word.',
    code: `path = "abfss://raw@myadls.dfs.core.windows.net/2026/sales.csv"
protocol = path.split("://")[0]
print(protocol)`,
    expectedOutput: `abfss`,
    explanation: 'split("://") cuts the string at the first "://", and [0] keeps the part before it, abfss. That scheme names Azure Data Lake Storage Gen2 over TLS (the s at the end), and the rest of the URI is container@account.dfs.core.windows.net followed by the path. On AWS the scheme is s3 and on Google Cloud gs.',
    hints: ['Extract the string before "://".'],
    tags: ['azure', 'adls', 'abfss', 'python'],
    concepts: ['dbx-dbfs'],
  },

  {
    id: 'dbx-storage-repos-17',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'A notebook in a Databricks Git folder (formerly Repos) sits next to a folder "helpers" that holds config_loader.py. Rearrange the lines to add the helpers folder to sys.path and then import config_loader.',
    correctOrder: [
      `import sys`,
      `import os`,
      `sys.path.append(os.path.abspath("./helpers"))`,
      `import config_loader`,
    ],
    distractorLines: [
      `sys.path.append(os.path.abspath("./helpers/config_loader.py"))`,
      `from . import config_loader`,
    ],
    solution: `import sys
import os
sys.path.append(os.path.abspath("./helpers"))
import config_loader`,
    explanation: 'A notebook in a Git folder runs with its own folder as the working directory, so os.path.abspath("./helpers") is the helpers folder, and once that folder is on sys.path, import config_loader finds config_loader.py. sys.path holds folders, not files, so appending the .py file\'s path does not help, and a relative import (from . import) fails in a notebook, which is not part of a package. Since the repository root is on sys.path anyway, from helpers import config_loader also works.',
    hints: ['sys.path is a list of folders to search.', 'A notebook is not inside a package.'],
    tags: ['repos', 'sys-path', 'python', 'parsons'],
    concepts: ['dbx-git-repos-modules'],
  },

  {
    id: 'dbx-storage-repos-18',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the URI scheme so that this statement reads the Delta table in container "landing" of the ADLS Gen2 storage account "myaccount" over TLS. The path lies inside a Unity Catalog external location you may read.',
    template: `df = spark.read.format("delta").load("___://landing@myaccount.dfs.core.windows.net/sales_data")`,
    blanks: ['abfss'],
    solution: `df = spark.read.format("delta").load("abfss://landing@myaccount.dfs.core.windows.net/sales_data")`,
    explanation: 'abfss is the Azure Blob File System scheme over TLS, used with the dfs.core.windows.net endpoint of ADLS Gen2: abfss://container@account.dfs.core.windows.net/path. wasbs is the older Blob storage driver on blob.core.windows.net. On Unity Catalog the path must lie in an external location you hold READ FILES on.',
    hints: ['The Azure Blob File System scheme, ending in s for secure.'],
    tags: ['azure', 'abfss', 'cloze', 'pyspark'],
    concepts: ['dbx-adls-access'],
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
    requires: [/parquet/],
    solution: `df = spark.read.format("parquet").load("abfss://analytics@mystorage.dfs.core.windows.net/events/year=2026")
# OR
df = spark.read.parquet("abfss://analytics@mystorage.dfs.core.windows.net/events/year=2026")
# OR
df = spark.read.load("abfss://analytics@mystorage.dfs.core.windows.net/events/year=2026", format="parquet")`,
    explanation: 'spark.read.format("parquet").load(uri), or the shortcut spark.read.parquet(uri), reads Parquet files straight from an ADLS Gen2 path. Because the path ends in the folder year=2026, the year column is not added: partition columns come from folder names below the path you read. On Unity Catalog the path must lie in an external location you hold READ FILES on.',
    hints: ['Use spark.read.format("parquet").load("abfss://...").'],
    tieredHints: {
      apiSignature: 'DataFrameReader.format(source: str).load(path: str) -> DataFrame',
      skeleton: 'df = ____.____.format(____).load(____)',
    },
    tags: ['pyspark', 'adls', 'abfss', 'parquet'],
    concepts: ['dbx-adls-access'],
  },



  {
    id: 'dbx-storage-repos-21',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Legacy, pre-Unity Catalog pattern: rearrange the lines to mount the ADLS Gen2 container "data" in storage account "mystorage" at "/mnt/data", with service principal OAuth settings in extra_configs (the client id, secret and endpoint keys are left out to keep the lines short).',
    correctOrder: [
      `configs = {"fs.azure.account.auth.type.mystorage.dfs.core.windows.net": "OAuth", "fs.azure.account.oauth.provider.type.mystorage.dfs.core.windows.net": "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider"}`,
      `dbutils.fs.mount(source="abfss://data@mystorage.dfs.core.windows.net/", mount_point="/mnt/data", extra_configs=configs)`,
    ],
    distractorLines: [
      `dbutils.fs.mount(source="s3a://data@mystorage/", mount_point="/mnt/data", extra_configs=configs)`,
      `dbutils.fs.mount(path="/mnt/data", source="abfss://data@mystorage.dfs.core.windows.net/")`,
    ],
    solution: `configs = {"fs.azure.account.auth.type.mystorage.dfs.core.windows.net": "OAuth", "fs.azure.account.oauth.provider.type.mystorage.dfs.core.windows.net": "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider"}
dbutils.fs.mount(source="abfss://data@mystorage.dfs.core.windows.net/", mount_point="/mnt/data", extra_configs=configs)`,
    explanation: 'dbutils.fs.mount takes source (an abfss:// URI for ADLS Gen2), mount_point and extra_configs, the dictionary of authentication settings, so the dictionary is built first. The parameter is mount_point, not path, and s3a:// is the AWS scheme. Mounts are legacy: every user of the workspace reaches the storage with the one service principal, and Unity Catalog cannot limit it per user, so new work uses external locations and volumes instead.',
    hints: ['Specify source with abfss:// protocol, mount_point, and pass extra_configs dictionary.'],
    tags: ['dbutils', 'fs', 'mount', 'azure', 'parsons'],
    concepts: ['dbx-adls-access'],
  },

  {
    id: 'dbx-storage-repos-22',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Legacy, pre-Unity Catalog pattern: complete the dbutils call that mounts the ADLS Gen2 container "raw" of storage account "store1" at /mnt/raw. The first blank is the method, the second the name of the parameter that sets where the mount appears.',
    template: `dbutils.fs.___(\n    source = "abfss://raw@store1.dfs.core.windows.net/",\n    ___ = "/mnt/raw",\n    extra_configs = configs\n)`,
    blanks: ['mount', 'mount_point'],
    solution: `dbutils.fs.mount(\n    source = "abfss://raw@store1.dfs.core.windows.net/",\n    mount_point = "/mnt/raw",\n    extra_configs = configs\n)`,
    explanation: 'dbutils.fs.mount(source, mount_point, extra_configs) makes the storage appear under /mnt in DBFS for every user of the workspace, signed in with the credentials in extra_configs. Mounts are legacy: Unity Catalog cannot limit them per user, so new work reaches files through volumes (/Volumes/...) and external locations instead.',
    hints: ['The dbutils.fs method that attaches storage under /mnt.', 'The parameter is named after the point where the storage is mounted.'],
    tags: ['dbutils', 'mount', 'adls', 'cloze'],
    concepts: ['dbx-adls-access'],
  },

  {
    id: 'dbx-storage-repos-23',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_STORAGE_REPOS,
    language: CodeLanguage.PYTHON,
    question: 'Legacy, pre-Unity Catalog pattern: these lines set direct ADLS Gen2 access with a service principal in the Spark config. Fill in the authentication type value and the name of the token provider class for client credentials.',
    template: `spark.conf.set("fs.azure.account.auth.type.account.dfs.core.windows.net", "___")\nspark.conf.set("fs.azure.account.oauth.provider.type.account.dfs.core.windows.net", "org.apache.hadoop.fs.azurebfs.oauth2.___")`,
    blanks: ['OAuth', 'ClientCredsTokenProvider'],
    solution: `spark.conf.set("fs.azure.account.auth.type.account.dfs.core.windows.net", "OAuth")\nspark.conf.set("fs.azure.account.oauth.provider.type.account.dfs.core.windows.net", "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider")`,
    explanation: 'For a service principal, the ABFS driver takes auth.type "OAuth" and the provider class org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider, plus the client id, secret and token endpoint in three more keys (not shown). This is direct access configured per cluster or session: anyone who can run code there uses the same identity. On Unity Catalog, a storage credential and an external location replace it.',
    hints: ['The auth type is the name of the token protocol.', 'The provider uses the service principal\'s client credentials.'],
    tags: ['spark-config', 'adls', 'oauth', 'cloze'],
    concepts: ['dbx-adls-access'],
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
    explanation: 'A magic command on a cell\'s first line switches that one cell: %sql runs the cell as Spark SQL in a Python notebook, and %sh runs it as a shell script on the driver only, here df -h to show the driver\'s disk usage. Variables do not cross between them: a Python variable is not visible in the %sql cell.',
    hints: ['A magic command is % followed by a short name for the language or tool.'],
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
      { id: 'b', text: 'A %sql cell runs on a SQL warehouse rather than on the notebook\'s cluster, so it cannot reach the Python process\'s memory.', isCorrect: false },
      { id: 'c', text: 'Python local variable state is not shared across language magic boundaries without creating a Spark Temp View or widget.', isCorrect: true },
      { id: 'd', text: 'Python variables reach %sql cells only on Dedicated (single user) compute, and this notebook runs on Standard compute.', isCorrect: false },
    ],
    explanation: 'Python variables live in the notebook\'s Python process, and a %sql cell is plain Spark SQL on the same cluster that never looks there, on any access mode. In SQL, :total_count is a parameter marker, which a widget or parameter of that name would fill. To hand Python values to SQL, create a widget, register a DataFrame as a temp view, or run the query from Python with spark.sql(..., args={...}).',
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
dbutils.widgets.get(name="env")
# OR
env = dbutils.widgets.get("env")`,
    explanation: 'dbutils.widgets.get(name) returns the widget\'s current value, or the value a job run passed for that name, always as a string. Assigning it to a variable is the usual next step.',
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
dbutils.secrets.get("prod_scope", "db_pass")
# OR
db_pass = dbutils.secrets.get(scope="prod_scope", key="db_pass")`,
    explanation: 'dbutils.secrets.get(scope, key) reads the secret\'s value at run time, if your permissions on the scope allow it, so the password never appears in the notebook. If the value is printed, Databricks shows [REDACTED] in its place.',
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
      { id: 'b', text: 'The value is printed in full, because only output shown with display() is redacted.', isCorrect: false },
      { id: 'c', text: 'The call raises a permission error, because a secret may only be passed to Spark options and connectors.', isCorrect: false },
      { id: 'd', text: 'The value is printed in full, and it is only masked later when the notebook is exported or shared.', isCorrect: false },
    ],
    explanation: 'Databricks replaces the secret\'s value with [REDACTED] wherever it would appear in cell output, print included, while the variable still holds the real value for your code to use. The redaction matches the exact string, so it is a guard against accidents, not a security boundary: printing the value changed, for example with spaces between its characters, would show it. Who may read a secret at all is decided by the scope\'s permissions.',
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
      { id: 'a', text: 'A cluster policy fixing the subnet each cluster starts in.', isCorrect: false },
      { id: 'b', text: 'Workspace permissions on folders and notebooks.', isCorrect: false },
      { id: 'c', text: 'Secret scope permissions on the sign-in credentials.', isCorrect: false },
      { id: 'd', text: 'IP access lists, set on the workspace by an admin.', isCorrect: true },
    ],
    explanation: 'IP access lists let a workspace admin allow or block CIDR ranges, so the web UI and the REST API only accept connections from the corporate network. A cluster\'s subnet decides where compute runs, not where users connect from, and folder or secret scope permissions decide what a signed-in user may do, not where they may sign in from.',
    hints: ['The restriction is on where users connect from.'],
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
      'conn_str = dbutils.secrets.get(scope="cloud_scope", key="conn_key")',
    ],
    solution: `dbutils.widgets.dropdown("region", "US", ["US", "EU", "APAC"])\nselected_region = dbutils.widgets.get("region")\nconn_key = f"conn_str_{selected_region}"\nconn_str = dbutils.secrets.get(scope="cloud_scope", key=conn_key)`,
    explanation: 'The dropdown must exist before its value can be read, and dbutils.widgets.get returns the chosen region as a string, which builds the key name, such as conn_str_EU. The secret lookup then passes the variable conn_key; the distractor passes the literal text "conn_key", which looks up a key with exactly that name whatever region was picked.',
    hints: ['Each line uses a name the line before it created.', 'The key argument should be the variable, not a string.'],
    tags: ['widgets', 'secrets', 'pipeline'],
    concepts: ['dbx-widgets-params', 'dbx-secret-scopes'],
  },

  {
    id: 'dbx-notebooks-sec-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_NOTEBOOKS_SECURITY,
    question: 'On Azure Databricks, what is the main advantage of an Azure Key Vault-backed secret scope over a Databricks-backed secret scope?',
    options: [
      { id: 'a', text: 'Secrets in a Key Vault-backed scope can be printed unredacted, which makes connection problems easier to debug.', isCorrect: false },
      { id: 'b', text: 'The secrets stay in Azure Key Vault, where they are managed and rotated in one place, and Databricks reads them from there.', isCorrect: true },
      { id: 'c', text: 'Only Key Vault-backed scopes can be read with dbutils.secrets.get; Databricks-backed scopes serve cluster configs only.', isCorrect: false },
      { id: 'd', text: 'A Key Vault-backed scope needs no Databricks permissions, so every workspace user can read its secrets without grants.', isCorrect: false },
    ],
    explanation: 'A Key Vault-backed scope points at an Azure Key Vault: the secrets are stored, rotated and audited there, alongside the organization\'s other secrets, and Databricks only reads them, so they are changed in Key Vault rather than through Databricks. Both kinds of scope are read the same way with dbutils.secrets.get, both redact printed values, and both have scope permissions deciding who may read them. Key Vault-backed scopes exist on Azure only; on AWS and Google Cloud, scopes are Databricks-backed.',
    hints: ['Where are the secrets of a Key Vault-backed scope actually kept?'],
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
  {
    id: 'dbx-notebooks-sec-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_NOTEBOOKS_SECURITY,
    language: CodeLanguage.PYTHON,
    question: 'Nobody has changed the widget in the notebook toolbar, so it holds its default value. What does this cell print? The answer is two lines, one per `print`.',
    code: `dbutils.widgets.text("batch_size", "10")
size = dbutils.widgets.get("batch_size")
print(size * 2)
print(int(size) * 2)`,
    expectedOutput: `1010
20`,
    explanation: 'A widget\'s value is always a string, whatever it looks like, so `dbutils.widgets.get` returns `"10"`, not `10`. Multiplying a string by 2 repeats it, which prints `1010`. Convert the value first, as the second `print` does with `int(size)`, to get the number 20.',
    hints: ['What type does dbutils.widgets.get return?', 'In Python, a string times 2 repeats the string.'],
    tags: ['dbutils', 'widgets', 'predict'],
    concepts: ['dbx-widgets'],
  },
];
