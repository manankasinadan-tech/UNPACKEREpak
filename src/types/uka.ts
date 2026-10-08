export type WorkspaceLocation = '/data/local/uka' | '/sdcard/SUPEROM' | string;

export type ExecutionMode = 'root' | 'non-root';

export type FileSystemType = 'erofs' | 'ext4' | 'f2fs' | 'auto';

export type PartitionType = 'system' | 'vendor' | 'product' | 'system_ext' | 'odm' | 'boot' | 'vendor_boot' | 'recovery' | 'init_boot' | 'vbmeta';

export interface PartitionMetadata {
  name: PartitionType | string;
  sizeBytes: number;
  fsType: FileSystemType;
  isSparse: boolean;
  blockSize: number;
  mountPoint: string;
  fileCount: number;
  dirCount: number;
  extractedDate: string;
  originalFileName: string;
  hasFileContexts: boolean;
  hasFsConfig: boolean;
}

export interface UnpackProfile {
  projectName: string;
  sourceType: 'zip' | 'payload' | 'super' | 'single_img' | 'ozip';
  sourceFileName: string;
  targetWorkspace: WorkspaceLocation;
  partitions: PartitionMetadata[];
  deviceArch: 'arm64-v8a' | 'armeabi-v7a' | 'x86_64';
  androidVersion: string;
  securityPatchDate: string;
  brand: string;
  deviceModel: string;
  fingerprint: string;
  isDynamicPartitions: boolean;
  hasVbmeta: boolean;
  unpackDate: string;
}

export interface WorkspaceFile {
  name: string;
  path: string;
  size: number;
  type: 'file' | 'directory';
  category: 'input' | 'unpacked' | 'output' | 'tools' | 'keys' | 'backup';
  modifiedDate: string;
  fsType?: FileSystemType;
}

export interface ConsoleLogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'cmd' | 'uka';
  text: string;
}

export interface SigningKey {
  alias: string;
  name: string;
  type: 'RSA' | 'EC';
  keySize: number;
  hasCertificate: boolean;
  isDefault: boolean;
  createdDate: string;
  fingerprint: string;
}

export interface GsiPortConfig {
  gsiSourceName: string;
  vendorBaseName: string;
  androidVersion: string;
  architecture: 'arm64' | 'arm32_binder64' | 'arm' | 'x86_64';
  patchBoot: boolean;
  selinuxMode: 'permissive' | 'enforcing';
  disableDmVerity: boolean;
  disableForcedEncryption: boolean;
  convertErofsToExt4: boolean;
  injectPhhTreble: boolean;
  fixVendorManifest: boolean;
  generateFastbootScript: boolean;
}

export type SidebarTab = 'unpack' | 'repack' | 'signer' | 'metagen';

export type MainNavTab = 'action' | 'porter' | 'console' | 'settings';
