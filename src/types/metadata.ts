export type RegistryMetadata = {
  /**
   * The name of the database
   */
  db_name: string;
  /**
   * The number of documents in the database
   */
  doc_count: number;
  /**
   * The number of deleted documents in the database
   */
  doc_del_count: number;
  /**
   * The update sequence number
   */
  update_seq: number;
  /**
   * The purge sequence number
   */
  purge_seq: number;
  /**
   * Whether the database is currently being compacted
   */
  compact_running: boolean;
  /**
   * The size of the database on disk
   */
  disk_size: number;
  /**
   * The size of the data in the database
   */
  data_size: number;
  /**
   * The time the instance started
   */
  instance_start_time: string;
  /**
   * The disk format version
   */
  disk_format_version: number;
  /**
   * The committed update sequence number
   */
  committed_update_seq: number;
};
