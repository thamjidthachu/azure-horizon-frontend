# API Connection Issues Debug Guide

## 🚨 **Current Issue: API Not Calling**

The API calls aren't working. Here's how to debug:

### **1. Check Browser Console**
Look for these logs in the browser console:
- `🌐 Attempting to fetch services from:` - Should show the API URL
- `🔧 API Base URL:` - Should show `http://localhost:8000`
- `🔍 Backend API health check:` - Should show status 200 or 404
- `❌ Backend API not reachable:` - Indicates connection issues

### **2. Common Causes & Solutions**

#### **A. Environment Variables Not Loaded**
**Symptoms:** `API Base URL: undefined` in console
**Solution:** Restart the development server
```bash
# Stop current server (Ctrl+C)
# Then restart:
yarn dev
```

#### **B. Backend Server Not Running**
**Symptoms:** `Backend API not reachable` error
**Solution:** Start the Django backend server
```bash
cd /mnt/d/Projects/playground/backend_azure_horizon
python manage.py runserver
```

#### **C. CORS Issues**
**Symptoms:** CORS error in browser console
**Solution:** Check Django CORS settings

#### **D. Wrong API URL**
**Symptoms:** 404 errors
**Solution:** Verify backend endpoint exists

### **3. Quick Tests**

#### **Test 1: Environment Variables**
In browser console, check:
```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
```

#### **Test 2: Backend Health**
Visit directly: `http://localhost:8000/`
Should return Django API response

#### **Test 3: Services Endpoint**
Visit: `http://localhost:8000/services/list/`
Should return services JSON

### **4. Current Debugging Added**

I've added comprehensive logging:
- **API URL validation**
- **Backend health check**
- **authFetch debugging** 
- **Response status logging**

### **5. Next Steps**

1. **Check browser console** for the debug logs
2. **Restart dev server** if env vars are undefined
3. **Start backend server** if health check fails
4. **Report what you see** in the console logs

## 🔧 **Debugging Commands**

```bash
# Check if backend is running
curl http://localhost:8000/

# Check services endpoint
curl http://localhost:8000/services/list/

# Restart frontend (if env vars missing)
yarn dev
```

Let me know what you see in the browser console!