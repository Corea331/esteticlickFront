// scripts/check-env.js
import { loadEnv } from 'vite'
import fs from 'fs'
import path from 'path'

console.log('🔍 Verificando entorno Vite...\n')
console.log('Directorio actual:', process.cwd())

// 1. Verificar si estamos en la raíz correcta
const rootFiles = fs.readdirSync(process.cwd())
console.log('\n📁 Archivos en raíz:')
console.log(rootFiles.filter(f => !f.startsWith('.')).join(', '))

// 2. Verificar archivo .env.local
const envPath = path.join(process.cwd(), '.env.local')
console.log('\n🔎 Buscando .env.local en:', envPath)

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local ENCONTRADO')
  const content = fs.readFileSync(envPath, 'utf8')
  console.log('\n📄 Contenido del archivo:')
  console.log('-------------------')
  console.log(content)
  console.log('-------------------')
  
  // Verificar formato
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'))
  console.log('\n📋 Líneas detectadas:')
  lines.forEach((line, i) => {
    console.log(`${i + 1}. ${line}`)
    
    // Verificar que comience con VITE_
    if (!line.startsWith('VITE_')) {
      console.log(`   ⚠️  ADVERTENCIA: No comienza con VITE_`)
    }
    
    // Verificar que tenga =
    if (!line.includes('=')) {
      console.log(`   ⚠️  ADVERTENCIA: No tiene signo =`)
    }
  })
} else {
  console.log('❌ .env.local NO ENCONTRADO')
  
  // Buscar otros archivos .env
  console.log('\n🔍 Buscando otros archivos .env:')
  const envFiles = rootFiles.filter(f => f.includes('.env'))
  if (envFiles.length > 0) {
    console.log('Encontrados:', envFiles.join(', '))
  } else {
    console.log('No se encontraron archivos .env')
  }
}

// 3. Verificar variables cargadas
console.log('\n🚀 Intentando cargar variables de entorno...')
try {
  // Intenta cargar en modo desarrollo
  const env = loadEnv('development', process.cwd(), '')
  
  console.log('\n✅ Variables cargadas exitosamente')
  console.log('\n📊 Valores detectados:')
  console.log('-------------------')
  console.log(`VITE_BLOB_READ_WRITE_TOKEN: ${env.VITE_BLOB_READ_WRITE_TOKEN || '❌ NO DEFINIDO'}`)
  if (env.VITE_BLOB_READ_WRITE_TOKEN) {
    console.log(`   Longitud: ${env.VITE_BLOB_READ_WRITE_TOKEN.length} caracteres`)
    console.log(`   Empieza con: ${env.VITE_BLOB_READ_WRITE_TOKEN.substring(0, 10)}...`)
  }
  
  console.log(`\nVITE_BLOB_BASE_URL: ${env.VITE_BLOB_BASE_URL || '❌ NO DEFINIDO'}`)
  if (env.VITE_BLOB_BASE_URL) {
    console.log(`   ¿Es URL válida?: ${env.VITE_BLOB_BASE_URL.startsWith('http') ? '✅' : '⚠️'}`)
  }
  
  console.log(`\nNODE_ENV: ${process.env.NODE_ENV || '❌ NO DEFINIDO'}`)
  console.log('-------------------')
  
} catch (error) {
  console.log('❌ Error al cargar variables:', error.message)
  console.log('Stack:', error.stack)
}

// 4. Verificar estructura de src/
console.log('\n📁 Estructura de src/:')
try {
  const srcPath = path.join(process.cwd(), 'src')
  if (fs.existsSync(srcPath)) {
    const srcFiles = fs.readdirSync(srcPath)
    console.log(srcFiles.map(f => `  📄 ${f}`).join('\n'))
  } else {
    console.log('❌ Carpeta src/ no encontrada')
  }
} catch (err) {
  console.log('Error al leer src/:', err.message)
}

console.log('\n✨ Verificación completada')