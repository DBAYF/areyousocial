# Firebase & Development Port Cleanup Commands

# Check what's running on key ports
echo '=== CHECKING PORTS ==='
lsof -i :3000,4000,5000,5001,8080,9099,9199,8000 2>/dev/null || echo 'No processes found on key ports'

# Kill Firebase emulators
echo '=== KILLING FIREBASE ==='
pkill -f 'firebase emulators' || echo 'No Firebase emulators running'

# Kill Next.js development server  
echo '=== KILLING NEXT.JS ==='
pkill -f 'next dev' || echo 'No Next.js dev server running'

# Kill Node processes
echo '=== KILLING NODE PROCESSES ==='
pkill -f 'node.*server' || echo 'No Node servers running'

# Kill Python servers (more thorough)
echo '=== KILLING PYTHON SERVERS ==='
pkill -f 'python.*http.server' || echo 'No Python http servers running'
pkill -f 'python.*server' || echo 'No Python servers running'

# Kill any processes on our key ports
echo '=== FORCE KILLING PORT PROCESSES ==='
for port in 3000 4000 5000 5001 8000 8080 9099 9199; do
  lsof -ti :$port | xargs kill -9 2>/dev/null || true
done

echo '=== CLEANUP COMPLETE ==='
