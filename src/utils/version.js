import { APP_VERSION, DATA_SCHEMA_VERSION } from '../config/version'
import { getStorage, setStorage, storageKeys } from './storage'

export const compareVersions = (v1, v2) => {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0
    const p2 = parts2[i] || 0
    if (p1 > p2) return 1
    if (p1 < p2) return -1
  }
  return 0
}

export const isNewerVersion = (current, latest) => {
  return compareVersions(latest, current) > 0
}

export const getDataVersion = () => {
  return getStorage(storageKeys.DATA_VERSION, 0)
}

export const setDataVersion = (version) => {
  setStorage(storageKeys.DATA_VERSION, version)
}

const migrationScripts = {
  1: (data) => {
    return { ...data, schemaVersion: 1 }
  }
}

export const migrateData = (data, fromVersion, toVersion = DATA_SCHEMA_VERSION) => {
  if (fromVersion >= toVersion) return data
  
  let migratedData = { ...data }
  for (let v = fromVersion + 1; v <= toVersion; v++) {
    if (migrationScripts[v]) {
      migratedData = migrationScripts[v](migratedData)
      console.log(`Migrated data to version ${v}`)
    }
  }
  return migratedData
}

export const checkAndMigrate = (storeName, data) => {
  const currentVersion = data?.schemaVersion || 0
  
  if (currentVersion < DATA_SCHEMA_VERSION) {
    console.log(`[${storeName}] Migrating from v${currentVersion} to v${DATA_SCHEMA_VERSION}`)
    const migratedData = migrateData(data, currentVersion)
    return { data: migratedData, migrated: true }
  }
  
  return { data, migrated: false }
}

export const formatVersion = (version, buildNumber) => {
  return `v${version} (build ${buildNumber})`
}

export const parseVersion = (versionString) => {
  const match = versionString.match(/v?(\d+\.\d+\.\d+)(?:\s*\(build\s*(\d+)\))?/)
  if (!match) return null
  return {
    version: match[1],
    buildNumber: match[2] ? parseInt(match[2], 10) : null
  }
}

export default {
  compareVersions,
  isNewerVersion,
  getDataVersion,
  setDataVersion,
  migrateData,
  checkAndMigrate,
  formatVersion,
  parseVersion
}
