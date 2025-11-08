import { build } from 'vite'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function buildApp() {
  try {
    console.log('Building TypeScript...')
    // Use node to run tsc directly instead of the binary
    await execAsync('node node_modules/typescript/lib/tsc.js')
    console.log('TypeScript build completed!')
    
    console.log('Building Vite...')
    await build()
    console.log('Vite build completed successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildApp()
