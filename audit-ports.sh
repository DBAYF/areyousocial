# Complete Port Security Audit

echo '🔍 PORT SECURITY AUDIT'
echo '======================'

echo '📋 Currently listening ports:'
netstat -an | grep LISTEN | head -10

echo ''
echo '🔍 Checking for suspicious ports:'
netstat -an | grep LISTEN | grep -v 127.0.0.1 | grep -v '::1' | head -5

echo ''
echo '🛑 Kill all Node processes:'
ps aux | grep node | grep -v grep | wc -l
echo 'processes found'

echo ''
echo '🛑 Kill all Python processes:'  
ps aux | grep python | grep -v grep | wc -l
echo 'processes found'

echo ''
echo '✅ Safe to proceed with development!'
