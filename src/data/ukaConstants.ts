import { PartitionMetadata, SigningKey, WorkspaceFile } from '../types/uka';

export const UKA_BANNER = `
  ██╗   ██╗██╗  ██╗ █████╗     ██╗   ██╗███╗   ██╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗ 
  ██║   ██║██║ ██╔╝██╔══██╗    ██║   ██║████╗  ██║██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
  ██║   ██║█████╔╝ ███████║    ██║   ██║██╔██╗ ██║██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝
  ██║   ██║██╔═██╗ ██╔══██║    ██║   ██║██║╚██╗██║██╔═══╝ ██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
  ╚██████╔╝██║  ██╗██║  ██║    ╚██████╔╝██║ ╚████║██║     ██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝     ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
                       Universal Kitchen for Android — Standalone Mobile Edition
                                     Version 4.5.2 (Pro Engine)
`;

export const INITIAL_SIGNING_KEYS: SigningKey[] = [
  {
    alias: 'testkey',
    name: 'Android AOSP TestKey (RSA 2048)',
    type: 'RSA',
    keySize: 2048,
    hasCertificate: true,
    isDefault: true,
    createdDate: '2025-01-10',
    fingerprint: '3B:E2:81:49:15:19:64:12:87:66:35:89:33:AA:7B:66',
  },
  {
    alias: 'uka_custom_release',
    name: 'UKA Production Master (RSA 4096)',
    type: 'RSA',
    keySize: 4096,
    hasCertificate: true,
    isDefault: false,
    createdDate: '2025-03-01',
    fingerprint: '8F:90:3A:C1:22:DE:B7:44:90:01:8A:EF:CD:67:88:99',
  },
  {
    alias: 'platform_key',
    name: 'Android Platform System Key',
    type: 'RSA',
    keySize: 2048,
    hasCertificate: true,
    isDefault: false,
    createdDate: '2025-02-15',
    fingerprint: '12:FA:7E:60:55:C3:9B:04:78:23:44:99:A1:B2:C3:D4',
  },
  {
    alias: 'media_shared',
    name: 'Android Media / Shared Key',
    type: 'RSA',
    keySize: 2048,
    hasCertificate: true,
    isDefault: false,
    createdDate: '2025-02-15',
    fingerprint: '6D:77:88:1A:BC:33:4F:9E:01:23:45:67:89:AB:CD:EF',
  },
];

export const INITIAL_PARTITIONS: PartitionMetadata[] = [
  {
    name: 'system',
    sizeBytes: 2984120320,
    fsType: 'erofs',
    isSparse: false,
    blockSize: 4096,
    mountPoint: '/system',
    fileCount: 4210,
    dirCount: 680,
    extractedDate: '2026-03-20 14:32',
    originalFileName: 'system.img',
    hasFileContexts: true,
    hasFsConfig: true,
  },
  {
    name: 'vendor',
    sizeBytes: 1124560896,
    fsType: 'erofs',
    isSparse: false,
    blockSize: 4096,
    mountPoint: '/vendor',
    fileCount: 1845,
    dirCount: 290,
    extractedDate: '2026-03-20 14:34',
    originalFileName: 'vendor.img',
    hasFileContexts: true,
    hasFsConfig: true,
  },
  {
    name: 'product',
    sizeBytes: 1654320128,
    fsType: 'erofs',
    isSparse: false,
    blockSize: 4096,
    mountPoint: '/product',
    fileCount: 2450,
    dirCount: 380,
    extractedDate: '2026-03-20 14:36',
    originalFileName: 'product.img',
    hasFileContexts: true,
    hasFsConfig: true,
  },
  {
    name: 'system_ext',
    sizeBytes: 745672704,
    fsType: 'erofs',
    isSparse: false,
    blockSize: 4096,
    mountPoint: '/system_ext',
    fileCount: 910,
    dirCount: 140,
    extractedDate: '2026-03-20 14:37',
    originalFileName: 'system_ext.img',
    hasFileContexts: true,
    hasFsConfig: true,
  },
  {
    name: 'odm',
    sizeBytes: 312450048,
    fsType: 'erofs',
    isSparse: false,
    blockSize: 4096,
    mountPoint: '/odm',
    fileCount: 412,
    dirCount: 75,
    extractedDate: '2026-03-20 14:38',
    originalFileName: 'odm.img',
    hasFileContexts: true,
    hasFsConfig: true,
  },
  {
    name: 'boot',
    sizeBytes: 67108864,
    fsType: 'ext4',
    isSparse: false,
    blockSize: 4096,
    mountPoint: '/boot',
    fileCount: 8,
    dirCount: 2,
    extractedDate: '2026-03-20 14:39',
    originalFileName: 'boot.img',
    hasFileContexts: true,
    hasFsConfig: true,
  },
];

export const SAMPLE_WORKSPACE_FILES: WorkspaceFile[] = [
  {
    name: 'LineageOS_21.0_arm64_bgN.zip',
    path: 'input/LineageOS_21.0_arm64_bgN.zip',
    size: 1420800000,
    type: 'file',
    category: 'input',
    modifiedDate: '2026-03-20 10:15',
  },
  {
    name: 'payload.bin',
    path: 'input/payload.bin',
    size: 2890500000,
    type: 'file',
    category: 'input',
    modifiedDate: '2026-03-19 18:22',
  },
  {
    name: 'super.img',
    path: 'input/super.img',
    size: 4720000000,
    type: 'file',
    category: 'input',
    fsType: 'erofs',
    modifiedDate: '2026-03-18 12:40',
  },
  {
    name: 'system.img',
    path: 'input/system.img',
    size: 2984120320,
    type: 'file',
    category: 'input',
    fsType: 'erofs',
    modifiedDate: '2026-03-20 14:00',
  },
  {
    name: 'system',
    path: 'unpacked/system',
    size: 2984120320,
    type: 'directory',
    category: 'unpacked',
    fsType: 'erofs',
    modifiedDate: '2026-03-20 14:32',
  },
  {
    name: 'vendor',
    path: 'unpacked/vendor',
    size: 1124560896,
    type: 'directory',
    category: 'unpacked',
    fsType: 'erofs',
    modifiedDate: '2026-03-20 14:34',
  },
  {
    name: 'config',
    path: 'unpacked/config',
    size: 4096,
    type: 'directory',
    category: 'unpacked',
    modifiedDate: '2026-03-20 14:32',
  },
  {
    name: 'system_file_contexts',
    path: 'unpacked/config/system_file_contexts',
    size: 182400,
    type: 'file',
    category: 'unpacked',
    modifiedDate: '2026-03-20 14:32',
  },
  {
    name: 'system_fs_config',
    path: 'unpacked/config/system_fs_config',
    size: 245100,
    type: 'file',
    category: 'unpacked',
    modifiedDate: '2026-03-20 14:32',
  },
  {
    name: 'unpack_info.json',
    path: 'unpacked/config/unpack_info.json',
    size: 2048,
    type: 'file',
    category: 'unpacked',
    modifiedDate: '2026-03-20 14:32',
  },
  {
    name: 'system_repacked.img',
    path: 'output/system_repacked.img',
    size: 2984120320,
    type: 'file',
    category: 'output',
    fsType: 'erofs',
    modifiedDate: '2026-03-20 15:10',
  },
  {
    name: 'super_repacked.img',
    path: 'output/super_repacked.img',
    size: 4720000000,
    type: 'file',
    category: 'output',
    fsType: 'erofs',
    modifiedDate: '2026-03-20 15:20',
  },
  {
    name: 'SuperROM_Custom_Flashable_v1.0.zip',
    path: 'output/SuperROM_Custom_Flashable_v1.0.zip',
    size: 3410000000,
    type: 'file',
    category: 'output',
    modifiedDate: '2026-03-20 15:35',
  },
];

export const UKA_COMMAND_LIST = [
  {
    cmd: 'uka unpack <file_or_type>',
    desc: 'Unpacks a ROM zip, payload.bin, super.img or image into the active workspace.',
    example: 'uka unpack input/payload.bin',
  },
  {
    cmd: 'uka repack <partition>',
    desc: 'Intelligently repacks the unpacked partition mirroring its exact original format (EROFS/EXT4, sparse, block size).',
    example: 'uka repack system --sparse',
  },
  {
    cmd: 'uka repack-super',
    desc: 'Builds a dynamic super.img using lpmake matching partition sizes and metadata slots.',
    example: 'uka repack-super --group main_a:6442450944',
  },
  {
    cmd: 'uka repack-rom',
    desc: 'Generates a complete flashable Custom ROM ZIP with dynamic partition scripts and boot.img.',
    example: 'uka repack-rom --name SuperROM_v1.zip',
  },
  {
    cmd: 'uka signer sign <apk_path>',
    desc: 'Signs an APK with selected key using apksigner (v1/v2/v3/v4 schemes) and applies zipalign.',
    example: 'uka signer sign input/MyApp.apk --key testkey',
  },
  {
    cmd: 'uka signer batch <folder>',
    desc: 'Batch-signs all APK files found in an unpacked partition (e.g. system/priv-app).',
    example: 'uka signer batch unpacked/system/priv-app',
  },
  {
    cmd: 'uka metagen fsvmeta <file>',
    desc: 'Generates fs-verity metadata file (.fsvmeta) for APKs or binaries.',
    example: 'uka metagen fsvmeta unpacked/system/framework/framework.jar',
  },
  {
    cmd: 'uka metagen oat <apk_or_jar>',
    desc: 'Generates odex/vdex/art files using on-device dex2oat engine.',
    example: 'uka metagen oat unpacked/system/app/Settings/Settings.apk',
  },
  {
    cmd: 'uka metagen config <partition>',
    desc: 'Regenerates fs_config and file_contexts after adding or modifying files.',
    example: 'uka metagen config system',
  },
  {
    cmd: 'uka porter gsi',
    desc: 'Runs automated GSI porting pipeline: patches boot, configures SELinux, injects Treble fixups.',
    example: 'uka porter gsi --source system.img --vendor vendor.img --permissive',
  },
  {
    cmd: 'uka workspace set <path>',
    desc: 'Switches current workspace between /data/local/uka, /sdcard/SUPEROM, or custom directory.',
    example: 'uka workspace set /sdcard/SUPEROM',
  },
  {
    cmd: 'uka status',
    desc: 'Displays active workspace, loaded partitions, root permissions, and disk space.',
    example: 'uka status',
  },
  {
    cmd: 'uka clean',
    desc: 'Cleans temporary mount points, caches, and intermediate extraction artifacts.',
    example: 'uka clean --temp',
  },
];

export const UKA_CHANGELOG = [
  {
    version: 'v4.5.2 (Pro Engine)',
    date: '2026-03-15',
    notes: [
      'Transformation complète en Application Android Autonome (.apk).',
      'Ajout du sélecteur d\'espace de travail : choix entre /data/local/uka (Root) et /sdcard/SUPEROM (Stockage interne non-root).',
      'Système de Repack Miroir Intelligent : détection et mémorisation automatique du format d\'origine (EROFS, EXT4, Sparse, BlockSize) pour un repack à l\'identique.',
      'Module PORTER GSI intégré avec correcteur de boot.img, bypass SELinux, et overlays Treble.',
      'Générateur de workflow GitHub Actions pour compilation d\'APK automatisée.',
    ],
  },
  {
    version: 'v4.2.0',
    date: '2025-11-20',
    notes: [
      'Prise en charge native d\'Android 15 et 16 (VanillaIceCream & Baklava).',
      'Support avancé de l\'assemblage EROFS avec compression lz4hc et détection d\'inodes 64-bit.',
      'Amélioration de lpmake pour partitions dynamiques Virtual A/B avec compression.',
      'Outil MetaGen : support de fs-verity (.fsvmeta) pour signature d\'intégrité des APK système.',
    ],
  },
  {
    version: 'v4.0.0',
    date: '2025-07-08',
    notes: [
      'Refonte complète du moteur de payload.bin : extraction multithreadée.',
      'Support du découpage et fusion des fichiers super.img segmentés (super.img.0, super.img.1...).',
      'Conversion à la volée EROFS vers EXT4 pour ROMs modifiables en lecture/écriture.',
      'Nouveau module SIGNER compatible signature v1, v2, v3 et v4 avec zipalign automatique.',
    ],
  },
  {
    version: 'v3.5.0',
    date: '2025-02-14',
    notes: [
      'Ajout du support brotli (.new.dat.br) haute vitesse et sdat2img optimisé.',
      'Génération automatique des file_contexts et fs_config synchronisés.',
      'Correction du bug de montage loop sur les noyaux sans support EROFS en mode non-root.',
    ],
  },
  {
    version: 'v3.0.0',
    date: '2024-09-01',
    notes: [
      'Support initial de Magisk/KernelSU et premier portage en script autonome.',
      'Extraction des firmwares OZIP (Realme/Oppo) et OFP.',
      'Éditeur intégré de build.prop avec correctifs de safetynet et bypass CTS.',
    ],
  },
];

export const GITHUB_WORKFLOW_TEMPLATE = `name: Build UKA Android APK

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    name: Build Android APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Dependencies
        run: npm install --legacy-peer-deps

      - name: Build Web Application
        run: npm run build

      - name: Sync Capacitor Android
        run: |
          mkdir -p android/app/src/main/assets/public
          cp -r dist/* android/app/src/main/assets/public/
          npx cap sync android

      - name: Setup Java JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Build Android APK with Gradle
        run: |
          cd android
          chmod +x ./gradlew
          ./gradlew assembleDebug --stacktrace

      - name: Upload Android APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: UKA-Unpacker-Kitchen-v4.5-Debug.apk
          path: android/app/build/outputs/apk/debug/*.apk
          retention-days: 30
`;
