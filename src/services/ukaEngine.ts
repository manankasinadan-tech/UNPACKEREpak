import {
  ConsoleLogEntry,
  ExecutionMode,
  FileSystemType,
  GsiPortConfig,
  PartitionMetadata,
  SigningKey,
  UnpackProfile,
  WorkspaceFile,
  WorkspaceLocation,
} from '../types/uka';
import {
  INITIAL_PARTITIONS,
  INITIAL_SIGNING_KEYS,
  SAMPLE_WORKSPACE_FILES,
  UKA_BANNER,
} from '../data/ukaConstants';

export class UkaEngine {
  private workspace: WorkspaceLocation = '/sdcard/SUPEROM';
  private mode: ExecutionMode = 'non-root';
  private files: WorkspaceFile[] = [...SAMPLE_WORKSPACE_FILES];
  private partitions: PartitionMetadata[] = [...INITIAL_PARTITIONS];
  private keys: SigningKey[] = [...INITIAL_SIGNING_KEYS];
  private logs: ConsoleLogEntry[] = [];
  private logListeners: ((logs: ConsoleLogEntry[]) => void)[] = [];
  private isProcessing: boolean = false;
  private currentProgress: number = 0;
  private currentStatusText: string = 'Prêt';
  private currentProfile: UnpackProfile = {
    projectName: 'SuperROM_Pixel8_Port',
    sourceType: 'super',
    sourceFileName: 'super.img',
    targetWorkspace: '/sdcard/SUPEROM',
    partitions: [...INITIAL_PARTITIONS],
    deviceArch: 'arm64-v8a',
    androidVersion: 'Android 15 (VanillaIceCream)',
    securityPatchDate: '2026-03-01',
    brand: 'Google',
    deviceModel: 'Pixel 8 Pro / Generic Treble',
    fingerprint: 'google/husky/husky:15/AP2A.260305.004/11542100:user/release-keys',
    isDynamicPartitions: true,
    hasVbmeta: true,
    unpackDate: '2026-03-20 14:30',
  };

  constructor() {
    this.addLog('uka', UKA_BANNER);
    this.addLog('info', `[INIT] Espace de travail configuré : ${this.workspace}`);
    this.addLog('info', `[INIT] Mode d'exécution : ${this.mode.toUpperCase()}`);
    this.addLog('success', `[READY] Moteur UKA v4.5.2 chargé avec succès. En attente de commande.`);
  }

  public getWorkspace(): WorkspaceLocation {
    return this.workspace;
  }

  public setWorkspace(path: WorkspaceLocation) {
    this.workspace = path;
    this.addLog('info', `[WORKSPACE] Espace de travail changé : ${path}`);
  }

  public getMode(): ExecutionMode {
    return this.mode;
  }

  public setMode(mode: ExecutionMode) {
    this.mode = mode;
    this.addLog('info', `[MODE] Mode d'exécution basculé sur : ${mode.toUpperCase()}${mode === 'root' ? ' (su privileged)' : ' (userspace tools)'}`);
  }

  public getFiles(): WorkspaceFile[] {
    return [...this.files];
  }

  public getPartitions(): PartitionMetadata[] {
    return [...this.partitions];
  }

  public getKeys(): SigningKey[] {
    return [...this.keys];
  }

  public getProfile(): UnpackProfile {
    return this.currentProfile;
  }

  public getLogs(): ConsoleLogEntry[] {
    return [...this.logs];
  }

  public getIsProcessing(): boolean {
    return this.isProcessing;
  }

  public getProgress(): number {
    return this.currentProgress;
  }

  public getStatusText(): string {
    return this.currentStatusText;
  }

  public onLog(listener: (logs: ConsoleLogEntry[]) => void) {
    this.logListeners.push(listener);
    listener([...this.logs]);
    return () => {
      this.logListeners = this.logListeners.filter((l) => l !== listener);
    };
  }

  public addLog(type: ConsoleLogEntry['type'], text: string) {
    const entry: ConsoleLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      text,
    };
    this.logs.push(entry);
    this.logListeners.forEach((l) => l([...this.logs]));
  }

  public clearLogs() {
    this.logs = [];
    this.addLog('info', '[CONSOLE] Historique des logs réinitialisé.');
  }

  public createSigningKey(alias: string, name: string, type: 'RSA' | 'EC', keySize: number): SigningKey {
    const newKey: SigningKey = {
      alias,
      name,
      type,
      keySize,
      hasCertificate: true,
      isDefault: false,
      createdDate: new Date().toISOString().split('T')[0],
      fingerprint: Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(':'),
    };
    this.keys.push(newKey);
    this.addLog('success', `[SIGNER] Nouvelle clé générée : ${alias} (${type} ${keySize} bits)`);
    this.addLog('info', `[KEYSTORE] Empreinte SHA-256 : ${newKey.fingerprint}`);
    return newKey;
  }

  // Sleep utility for realistic asynchronous execution feedback
  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // --- 1. UNPACK PIPELINE ---
  public async unpackTarget(
    sourceType: 'zip' | 'payload' | 'super' | 'single_img',
    fileName: string,
    onProgress?: (progress: number, step: string) => void
  ): Promise<boolean> {
    if (this.isProcessing) return false;
    this.isProcessing = true;
    this.currentProgress = 0;

    const notify = (prog: number, step: string) => {
      this.currentProgress = prog;
      this.currentStatusText = step;
      if (onProgress) onProgress(prog, step);
    };

    try {
      this.addLog('uka', `>>> DÉMARRAGE UNPACK : ${fileName} (${sourceType.toUpperCase()}) <<<`);
      this.addLog('info', `[UNPACK] Espace de destination : ${this.workspace}/unpacked`);
      notify(5, 'Analyse de l\'en-tête du fichier...');
      await this.sleep(400);

      if (sourceType === 'zip') {
        notify(15, 'Décompression de l\'archive flashable...');
        this.addLog('info', `[ZIP] Inspection des entrées : META-INF, payload.bin, super.img, images...`);
        await this.sleep(600);

        this.addLog('info', `[ZIP] Détection d'un conteneur dynamique 'super.img' et 'boot.img'`);
        notify(35, 'Extraction des images brutes...');
        await this.sleep(500);
      } else if (sourceType === 'payload') {
        notify(15, 'Lecture de payload.bin manifest (Google OTA format)...');
        this.addLog('info', `[PAYLOAD] Protobuf delta update v2 détecté.`);
        await this.sleep(600);

        const partitionsToExtract = ['system', 'vendor', 'product', 'system_ext', 'odm', 'boot', 'vbmeta'];
        for (let i = 0; i < partitionsToExtract.length; i++) {
          const p = partitionsToExtract[i];
          const pct = Math.round(25 + (i / partitionsToExtract.length) * 45);
          notify(pct, `Extraction de la partition : ${p}.img...`);
          this.addLog('info', `[PAYLOAD_DUMPER] Décompression de ${p} (chunk operations appliqué)`);
          await this.sleep(300);
        }
      } else if (sourceType === 'super') {
        notify(20, 'Analyse de la table des métadonnées LP (lpunpack)...');
        this.addLog('info', `[SUPER] Super partition dynamique : Geometry BlockSize=4096, Group=main_a (6.2 GB)`);
        await this.sleep(600);

        notify(45, 'Découpage des sous-partitions (system, vendor, product, system_ext, odm)...');
        this.addLog('info', `[LPUNPACK] system_a -> unpacked/system.img (2.98 GB)`);
        this.addLog('info', `[LPUNPACK] vendor_a -> unpacked/vendor.img (1.12 GB)`);
        this.addLog('info', `[LPUNPACK] product_a -> unpacked/product.img (1.65 GB)`);
        await this.sleep(500);
      } else {
        notify(25, `Examen de l'image brute : ${fileName}...`);
        await this.sleep(400);
      }

      // Detection of filesystem & sparse
      notify(70, 'Détection du système de fichiers (EROFS / EXT4 / F2FS)...');
      await this.sleep(400);
      this.addLog('success', `[FS_DETECT] Système de fichiers identifié : EROFS (Enhanced Read-Only FS)`);
      this.addLog('info', `[FS_DETECT] Compression: lz4hc, Inodes: 64-bit, Sparse: Non`);

      notify(85, 'Génération des tables SELinux file_contexts & fs_config...');
      await this.sleep(500);
      this.addLog('info', `[SELINUX] 12 450 entrées extraites vers unpacked/config/system_file_contexts`);
      this.addLog('info', `[FS_CONFIG] Droits UID/GID/Capabilities sauvegardés dans unpacked/config/system_fs_config`);

      notify(95, 'Enregistrement du profil miroir dans unpack_info.json...');
      await this.sleep(300);
      this.addLog('success', `[MIRROR_ENGINE] Métadonnées exactes enregistrées pour garantir un repack à l'identique !`);

      notify(100, 'Unpack terminé avec succès !');
      this.addLog('uka', `>>> UNPACK TERMINÉ : Toutes les partitions sont prêtes dans ${this.workspace}/unpacked <<<`);

      // Refresh files list
      const newFile: WorkspaceFile = {
        name: `${fileName.replace(/\.[^/.]+$/, "")}_extracted`,
        path: `unpacked/${fileName.replace(/\.[^/.]+$/, "")}`,
        size: 3200000000,
        type: 'directory',
        category: 'unpacked',
        fsType: 'erofs',
        modifiedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      this.files.unshift(newFile);

      return true;
    } catch (err: any) {
      this.addLog('error', `[ERREUR UNPACK] ${err?.message || 'Échec de l\'opération'}`);
      return false;
    } finally {
      this.isProcessing = false;
    }
  }

  // --- 2. REPACK PIPELINE (INTELLIGENT MIRROR MATCHING) ---
  public async repackPartition(
    partitionName: string,
    targetFs: FileSystemType = 'auto',
    isSparse: boolean = false,
    onProgress?: (progress: number, step: string) => void
  ): Promise<boolean> {
    if (this.isProcessing) return false;
    this.isProcessing = true;
    this.currentProgress = 0;

    const notify = (prog: number, step: string) => {
      this.currentProgress = prog;
      this.currentStatusText = step;
      if (onProgress) onProgress(prog, step);
    };

    try {
      const part = this.partitions.find((p) => p.name.toLowerCase() === partitionName.toLowerCase()) || this.partitions[0];
      const finalFs = targetFs === 'auto' ? part.fsType : targetFs;

      this.addLog('uka', `>>> REPACK INTELLIGENT : Partition '${part.name}' <<<`);
      this.addLog('info', `[REPACK_MIRROR] Format d'origine : ${part.fsType.toUpperCase()}`);
      this.addLog('info', `[REPACK_TARGET] Format de sortie sélectionné : ${finalFs.toUpperCase()}`);
      this.addLog('info', `[REPACK_CONFIG] Utilisation de ${this.workspace}/unpacked/config/${part.name}_fs_config`);
      this.addLog('info', `[REPACK_CONFIG] Contexte SELinux : ${this.workspace}/unpacked/config/${part.name}_file_contexts`);

      notify(10, 'Vérification de l\'intégrité des fichiers...');
      await this.sleep(400);

      notify(30, 'Vérification et alignement des permissions fs_config...');
      this.addLog('info', `[FS_CONFIG] Alignement de 4 210 nœuds de fichiers et 680 répertoires`);
      await this.sleep(500);

      notify(55, `Compilation de l'image système avec mkfs.${finalFs}...`);
      if (finalFs === 'erofs') {
        this.addLog('cmd', `mkfs.erofs -z lz4hc -C 65536 --file-contexts=... ${this.workspace}/output/${part.name}_repacked.img ${this.workspace}/unpacked/${part.name}`);
      } else {
        this.addLog('cmd', `make_ext4fs -T 1230768000 -S ... -l ${part.sizeBytes} -a ${part.mountPoint} ${this.workspace}/output/${part.name}_repacked.img ${this.workspace}/unpacked/${part.name}`);
      }
      await this.sleep(800);

      if (isSparse) {
        notify(80, 'Conversion en image clairsemée (img2simg)...');
        this.addLog('info', `[SPARSE] Compression des blocs nuls : 2.98 GB -> 1.42 GB sparse image`);
        await this.sleep(400);
      }

      notify(95, 'Calcul de la somme de contrôle SHA-256...');
      await this.sleep(300);
      this.addLog('success', `[CHECKSUM] SHA-256 : d41d8cd98f00b204e9800998ecf8427e`);

      notify(100, 'Repack terminé !');
      this.addLog('success', `[SUCCÈS] Image créée : ${this.workspace}/output/${part.name}_repacked.img`);

      // Add to files
      this.files.unshift({
        name: `${part.name}_repacked.img`,
        path: `output/${part.name}_repacked.img`,
        size: part.sizeBytes,
        type: 'file',
        category: 'output',
        fsType: finalFs,
        modifiedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });

      return true;
    } catch (err: any) {
      this.addLog('error', `[ERREUR REPACK] ${err?.message || 'Échec du repack'}`);
      return false;
    } finally {
      this.isProcessing = false;
    }
  }

  // --- 3. REPACK SUPER & FLASHABLE ROM ---
  public async repackSuperImage(
    selectedPartitions: string[],
    groupSize: number = 6442450944,
    onProgress?: (progress: number, step: string) => void
  ): Promise<boolean> {
    if (this.isProcessing) return false;
    this.isProcessing = true;
    this.currentProgress = 0;

    const notify = (prog: number, step: string) => {
      this.currentProgress = prog;
      this.currentStatusText = step;
      if (onProgress) onProgress(prog, step);
    };

    try {
      this.addLog('uka', `>>> REPACK SUPER.IMG (DYNAMIC PARTITIONS LPMAKE) <<<`);
      notify(15, 'Calcul des blocs dynamiques lpmake...');
      this.addLog('info', `[LPMAKE] Super Group 'main_a' alloué : ${(groupSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
      this.addLog('info', `[LPMAKE] Partitions incluses : ${selectedPartitions.join(', ')}`);
      await this.sleep(600);

      notify(45, 'Génération des tables de métadonnées LP...');
      this.addLog('cmd', `lpmake --metadata-size 65536 --super-name super --metadata-slots 3 --device super:${groupSize} --group main_a:${groupSize} ...`);
      await this.sleep(800);

      notify(75, 'Écriture des partitions dans le conteneur super...');
      await this.sleep(700);

      notify(100, 'super.img assemblé avec succès !');
      this.addLog('success', `[SUPER] Fichier généré : ${this.workspace}/output/super_repacked.img`);

      return true;
    } catch (err: any) {
      this.addLog('error', `[ERREUR SUPER] ${err?.message}`);
      return false;
    } finally {
      this.isProcessing = false;
    }
  }

  public async repackFlashableRomZip(
    romName: string,
    onProgress?: (progress: number, step: string) => void
  ): Promise<boolean> {
    if (this.isProcessing) return false;
    this.isProcessing = true;
    this.currentProgress = 0;

    const notify = (prog: number, step: string) => {
      this.currentProgress = prog;
      this.currentStatusText = step;
      if (onProgress) onProgress(prog, step);
    };

    try {
      this.addLog('uka', `>>> CRÉATION DE LA ROM FLASHABLE COMPLÈTE (.ZIP) <<<`);
      notify(10, 'Génération de update-binary & updater-script...');
      this.addLog('info', `[ROM_BUILDER] Création du script d\'installation dynamique pour TWRP/OrangeFox`);
      await this.sleep(500);

      notify(35, 'Inclusion du noyau boot.img et vendor_boot...');
      this.addLog('info', `[ROM_BUILDER] Ajout de boot.img (Kernel + Ramdisk init)`);
      await this.sleep(600);

      notify(65, 'Compression des partitions dynamiques (dat.br ou super.img)...');
      await this.sleep(800);

      notify(90, 'Signature de l\'archive flashable ZIP avec testkey...');
      this.addLog('info', `[SIGNER] META-INF/CERT.RSA & CERT.SF signés.`);
      await this.sleep(500);

      notify(100, 'ROM Custom Flashable générée !');
      const finalName = romName.endsWith('.zip') ? romName : `${romName}.zip`;
      this.addLog('success', `[ROM_BUILDER] Archive complète prête : ${this.workspace}/output/${finalName}`);

      return true;
    } catch (err: any) {
      this.addLog('error', `[ERREUR ROM] ${err?.message}`);
      return false;
    } finally {
      this.isProcessing = false;
    }
  }

  // --- 4. SIGNER PIPELINE ---
  public async signApk(
    apkPath: string,
    keyAlias: string,
    applyZipalign: boolean = true,
    schemes: { v1: boolean; v2: boolean; v3: boolean; v4: boolean } = { v1: true, v2: true, v3: true, v4: true },
    onProgress?: (progress: number, step: string) => void
  ): Promise<boolean> {
    if (this.isProcessing) return false;
    this.isProcessing = true;
    this.currentProgress = 0;

    const notify = (prog: number, step: string) => {
      this.currentProgress = prog;
      this.currentStatusText = step;
      if (onProgress) onProgress(prog, step);
    };

    try {
      this.addLog('uka', `>>> APKSIGNER : Signature de '${apkPath}' <<<`);
      this.addLog('info', `[SIGNER] Clé sélectionnée : ${keyAlias}`);
      this.addLog('info', `[SIGNER] Schémas actifs : V1=${schemes.v1}, V2=${schemes.v2}, V3=${schemes.v3}, V4=${schemes.v4}`);

      notify(20, 'Nettoyage des signatures existantes (META-INF)...');
      await this.sleep(400);

      if (applyZipalign) {
        notify(45, 'Application de zipalign (alignement 4-octets pour mmap)...');
        this.addLog('cmd', `zipalign -p -f -v 4 ${apkPath} ${apkPath}.aligned`);
        await this.sleep(500);
      }

      notify(75, 'Calcul des blocs de signature et certificat X.509...');
      this.addLog('cmd', `apksigner sign --key keys/${keyAlias}.pk8 --cert keys/${keyAlias}.x509.pem ...`);
      await this.sleep(600);

      notify(90, 'Vérification avec apksigner verify...');
      this.addLog('success', `[APKSIGNER] Vérification OK : APK Signature Scheme v2/v3/v4 validé !`);
      await this.sleep(300);

      notify(100, 'Signature terminée !');
      this.addLog('success', `[SUCCÈS] APK signé enregistré : ${this.workspace}/output/${apkPath.split('/').pop()?.replace('.apk', '_signed.apk')}`);
      return true;
    } catch (err: any) {
      this.addLog('error', `[ERREUR SIGNER] ${err?.message}`);
      return false;
    } finally {
      this.isProcessing = false;
    }
  }

  public async batchSignFolder(
    folderPath: string,
    keyAlias: string,
    onProgress?: (progress: number, step: string) => void
  ): Promise<boolean> {
    if (this.isProcessing) return false;
    this.isProcessing = true;
    this.currentProgress = 0;

    try {
      this.addLog('uka', `>>> BATCH SIGNER : Signature de tous les APK de '${folderPath}' <<<`);
      const sampleApks = ['SystemUI.apk', 'Settings.apk', 'Framework-res.apk', 'Telecom.apk', 'Launcher3.apk'];
      for (let i = 0; i < sampleApks.length; i++) {
        const apk = sampleApks[i];
        const pct = Math.round(((i + 1) / sampleApks.length) * 100);
        if (onProgress) onProgress(pct, `Signature de ${apk}...`);
        this.addLog('info', `[BATCH] (${i + 1}/${sampleApks.length}) Zipalign + Signature de ${apk}`);
        await this.sleep(350);
      }
      this.addLog('success', `[BATCH TERMINÉ] ${sampleApks.length} applications système signées avec succès.`);
      return true;
    } finally {
      this.isProcessing = false;
    }
  }

  // --- 5. METAGEN PIPELINE ---
  public async generateFsvMeta(targetFile: string): Promise<boolean> {
    this.addLog('uka', `>>> METAGEN : Génération fs-verity metadata (.fsvmeta) <<<`);
    this.addLog('info', `[FSVMETA] Calcul de l'arbre Merkle SHA-256 pour ${targetFile}`);
    await this.sleep(500);
    this.addLog('cmd', `fsvmeta sign --key keys/testkey.pk8 --cert keys/testkey.x509.pem ${targetFile}`);
    await this.sleep(400);
    this.addLog('success', `[FSVMETA CRÉÉ] Fichier généré : ${targetFile}.fsvmeta`);
    return true;
  }

  public async generateOatOdex(targetFile: string, arch: string = 'arm64'): Promise<boolean> {
    this.addLog('uka', `>>> METAGEN : Compilation AOT dex2oat (${arch}) <<<`);
    this.addLog('info', `[DEX2OAT] Pré-compilation du bytecode DEX en code machine natif pour ${targetFile}`);
    await this.sleep(600);
    this.addLog('cmd', `dex2oat --instruction-set=${arch} --compiler-filter=speed --dex-file=${targetFile} --oat-file=${targetFile.replace('.apk', '.odex')}`);
    await this.sleep(500);
    this.addLog('success', `[DEX2OAT SUCCÈS] .odex et .vdex générés avec succès pour ${arch}`);
    return true;
  }

  // --- 6. GSI PORTER PIPELINE ---
  public async runGsiPorter(
    config: GsiPortConfig,
    onProgress?: (progress: number, step: string) => void
  ): Promise<boolean> {
    if (this.isProcessing) return false;
    this.isProcessing = true;
    this.currentProgress = 0;

    const notify = (prog: number, step: string) => {
      this.currentProgress = prog;
      this.currentStatusText = step;
      if (onProgress) onProgress(prog, step);
    };

    try {
      this.addLog('uka', `>>> PORTER GSI : Démarrage du portage GSI Treble <<<`);
      this.addLog('info', `[GSI] Source GSI : ${config.gsiSourceName}`);
      this.addLog('info', `[VENDOR] Base Stock : ${config.vendorBaseName}`);
      this.addLog('info', `[ARCH] Architecture cible : ${config.architecture}`);

      notify(10, 'Vérification de la compatibilité Treble (VNDK & AIDL)...');
      await this.sleep(500);

      if (config.patchBoot) {
        notify(30, 'Application des patchs au boot.img (magiskboot)...');
        this.addLog('info', `[BOOT_PATCH] Décompression ramdisk de boot.img`);
        if (config.selinuxMode === 'permissive') {
          this.addLog('info', `[SELINUX] Injection de 'androidboot.selinux=permissive' dans cmdline`);
        }
        if (config.disableDmVerity) {
          this.addLog('info', `[VB_META] Désactivation de dm-verity et verification d'avb`);
        }
        if (config.disableForcedEncryption) {
          this.addLog('info', `[FSTAB] Remplacement de 'fileencryption=' par 'encryptable' dans fstab`);
        }
        await this.sleep(700);
      }

      if (config.convertErofsToExt4) {
        notify(55, 'Conversion EROFS vers EXT4 pour accès Read-Write...');
        this.addLog('info', `[EROFS2EXT4] Extraction de l'arbre et reconstruction en EXT4 RW`);
        await this.sleep(800);
      }

      if (config.injectPhhTreble) {
        notify(70, 'Injection des scripts et correctifs phh Treble...');
        this.addLog('info', `[PHH] Ajout de rw-system.sh, phh-on-boot.sh et services de compatibilité`);
        await this.sleep(600);
      }

      if (config.fixVendorManifest) {
        notify(85, 'Correction de compatibility_matrix.xml et vendor manifest...');
        this.addLog('info', `[VINTF] Alignement des interfaces HAL HIDL/AIDL`);
        await this.sleep(500);
      }

      if (config.generateFastbootScript) {
        notify(95, 'Génération des scripts flash_all.sh & flash_all.bat...');
        this.addLog('info', `[FASTBOOT] Scripts de flashage Fastbootd créés avec succès.`);
        await this.sleep(300);
      }

      notify(100, 'Portage GSI terminé !');
      this.addLog('success', `[PORTER] GSI prête à être flashée dans : ${this.workspace}/output/GSI_Ported_System.img`);
      return true;
    } catch (err: any) {
      this.addLog('error', `[ERREUR PORTER] ${err?.message}`);
      return false;
    } finally {
      this.isProcessing = false;
    }
  }

  // --- 7. CLI COMMAND INTERPRETER ---
  public async executeCommand(rawCmd: string): Promise<void> {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    this.addLog('cmd', `$ ${trimmed}`);
    const parts = trimmed.split(/\s+/);
    const main = parts[0].toLowerCase();

    if (main === 'clear') {
      this.clearLogs();
      return;
    }

    if (main === 'help' || (main === 'uka' && parts[1] === 'help')) {
      this.addLog('uka', UKA_BANNER);
      this.addLog('info', 'Commandes UKA disponibles :');
      this.addLog('info', '  uka unpack <fichier>               : Déballe un zip, payload.bin, super.img ou image');
      this.addLog('info', '  uka repack <partition> [--sparse]  : Repacke avec le même format et structure d\'origine');
      this.addLog('info', '  uka repack-super                   : Compile super.img dynamique (lpmake)');
      this.addLog('info', '  uka repack-rom <nom.zip>           : Crée une ROM Flashable complète');
      this.addLog('info', '  uka signer sign <apk> [--key nom]  : Signe un APK avec apksigner et zipalign');
      this.addLog('info', '  uka signer batch <dossier>         : Signe tous les APK d\'une partition');
      this.addLog('info', '  uka metagen fsvmeta <fichier>      : Génère fs-verity metadata');
      this.addLog('info', '  uka metagen oat <apk>              : Compilation dex2oat natif');
      this.addLog('info', '  uka porter gsi                     : Lance le pipeline de portage GSI');
      this.addLog('info', '  uka workspace set <chemin>         : Change le dossier de travail (/data/local/uka ou /sdcard/SUPEROM)');
      this.addLog('info', '  uka status                         : État actuel du kitchen et des partitions');
      this.addLog('info', '  uka clean                          : Nettoie les caches et fichiers temporaires');
      return;
    }

    if (main === 'su') {
      this.setMode('root');
      this.addLog('success', 'Root accordé (uid=0 gid=0 context=u:r:magisk:s0)');
      return;
    }

    if (main === 'id' || main === 'whoami') {
      this.addLog('info', this.mode === 'root' ? 'uid=0(root) gid=0(root) groups=0(root) context=u:r:su:s0' : 'uid=10234(u0_a234) gid=10234(u0_a234) groups=10234,3003(inet),9997');
      return;
    }

    if (main === 'pwd') {
      this.addLog('info', this.workspace);
      return;
    }

    if (main === 'ls') {
      const sub = parts[1] || '';
      const filtered = this.files.filter((f) => sub ? f.path.startsWith(sub) : true);
      this.addLog('info', filtered.map((f) => `${f.type === 'directory' ? 'd' : '-'}rw-r--r--  ${f.name}  (${(f.size / 1024 / 1024).toFixed(1)} MB)`).join('\n'));
      return;
    }

    if (main === 'uka') {
      const sub = parts[1]?.toLowerCase();
      if (!sub || sub === 'status') {
        this.addLog('uka', `[STATUT UKA] Version: 4.5.2 | Mode: ${this.mode.toUpperCase()}`);
        this.addLog('info', `Espace de travail actif : ${this.workspace}`);
        this.addLog('info', `Partitions chargées : ${this.partitions.map((p) => p.name).join(', ')}`);
        this.addLog('info', `Clés de signature disponibles : ${this.keys.map((k) => k.alias).join(', ')}`);
        return;
      }

      if (sub === 'workspace' && parts[2] === 'set') {
        const newPath = parts[3];
        if (newPath) {
          this.setWorkspace(newPath);
        } else {
          this.addLog('error', 'Syntaxe : uka workspace set <chemin>');
        }
        return;
      }

      if (sub === 'clean') {
        this.addLog('info', '[CLEAN] Suppression des montages et fichiers temporaires...');
        await this.sleep(400);
        this.addLog('success', '[CLEAN] Nettoyage terminé.');
        return;
      }

      if (sub === 'unpack') {
        const target = parts[2] || 'input/super.img';
        await this.unpackTarget('super', target);
        return;
      }

      if (sub === 'repack') {
        const partName = parts[2] || 'system';
        const isSparse = parts.includes('--sparse');
        await this.repackPartition(partName, 'auto', isSparse);
        return;
      }

      if (sub === 'repack-super') {
        await this.repackSuperImage(this.partitions.map((p) => p.name));
        return;
      }

      if (sub === 'repack-rom') {
        const name = parts[2] || 'SuperROM_Flashable.zip';
        await this.repackFlashableRomZip(name);
        return;
      }

      if (sub === 'signer') {
        if (parts[2] === 'sign') {
          const apk = parts[3] || 'MyApp.apk';
          await this.signApk(apk, 'testkey');
          return;
        }
        if (parts[2] === 'batch') {
          const folder = parts[3] || 'unpacked/system/priv-app';
          await this.batchSignFolder(folder, 'testkey');
          return;
        }
      }

      if (sub === 'metagen') {
        if (parts[2] === 'fsvmeta') {
          await this.generateFsvMeta(parts[3] || 'unpacked/system/framework/framework.jar');
          return;
        }
        if (parts[2] === 'oat') {
          await this.generateOatOdex(parts[3] || 'unpacked/system/app/Settings/Settings.apk');
          return;
        }
      }

      if (sub === 'porter') {
        await this.runGsiPorter({
          gsiSourceName: 'system.img',
          vendorBaseName: 'vendor.img',
          androidVersion: '15',
          architecture: 'arm64',
          patchBoot: true,
          selinuxMode: 'permissive',
          disableDmVerity: true,
          disableForcedEncryption: true,
          convertErofsToExt4: false,
          injectPhhTreble: true,
          fixVendorManifest: true,
          generateFastbootScript: true,
        });
        return;
      }
    }

    // Default fallback
    this.addLog('warning', `Commande inconnue ou non implémentée : ${trimmed}. Tapez 'uka help' pour voir la liste.`);
  }
}

// Global singleton engine instance
export const ukaEngineInstance = new UkaEngine();
