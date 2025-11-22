import fs from 'fs'
import path from 'path'
import { WaitlistEntry } from './supabase'

// File-based storage for development/testing when Supabase is not available
const STORAGE_FILE = path.join(process.cwd(), 'data', 'waitlist.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(STORAGE_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read waitlist data from file
function readWaitlistData(): WaitlistEntry[] {
  try {
    ensureDataDirectory()
    if (!fs.existsSync(STORAGE_FILE)) {
      return []
    }
    const data = fs.readFileSync(STORAGE_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading waitlist data:', error)
    return []
  }
}

// Write waitlist data to file
function writeWaitlistData(data: WaitlistEntry[]) {
  try {
    ensureDataDirectory()
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error writing waitlist data:', error)
    throw new Error('Failed to save data')
  }
}

// Fallback storage functions
export const fallbackStorage = {
  // Add new entry
  async insert(entry: Omit<WaitlistEntry, 'id' | 'created_at'>): Promise<WaitlistEntry> {
    const data = readWaitlistData()
    
    // Check for duplicate email
    const existingEntry = data.find(item => item.email === entry.email)
    if (existingEntry) {
      throw new Error('Email already exists')
    }
    
    const newEntry: WaitlistEntry = {
      id: generateId(),
      ...entry,
      created_at: new Date().toISOString()
    }
    
    data.push(newEntry)
    writeWaitlistData(data)
    
    return newEntry
  },

  // Find entry by email
  async findByEmail(email: string): Promise<WaitlistEntry | null> {
    const data = readWaitlistData()
    return data.find(item => item.email === email) || null
  },

  // Get total count
  async count(): Promise<number> {
    const data = readWaitlistData()
    return data.length
  },

  // Get all entries (for admin use)
  async findAll(): Promise<WaitlistEntry[]> {
    return readWaitlistData()
  }
}

// Generate a simple ID for fallback storage
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Check if we should use fallback storage
// In production, this should always return false
export function shouldUseFallback(): boolean {
  const useFallback = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (useFallback && process.env.NODE_ENV === 'production') {
    console.error('WARNING: Supabase not configured in production! Please set environment variables.')
  }
  
  return useFallback
}