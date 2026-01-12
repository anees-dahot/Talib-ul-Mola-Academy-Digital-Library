# WordPress PDF Hosting Setup Guide

## ✅ Yes, WordPress is a Great Choice for PDF Hosting!

**Advantages:**
- ✅ Reliable hosting infrastructure
- ✅ Built-in media library
- ✅ Proper CORS headers (usually)
- ✅ CDN support (if using WordPress.com or hosts with CDN)
- ✅ Easy to manage and update PDFs
- ✅ Direct download links
- ✅ Works well with react-pdf

---

## 📤 How to Upload PDFs to WordPress

### Method 1: WordPress Media Library (Recommended)

1. **Login to WordPress Admin**
   - Go to `yoursite.com/wp-admin`
   - Login with your credentials

2. **Upload PDF Files**
   - Click **Media** → **Add New**
   - Drag & drop your PDF files or click **Select Files**
   - Wait for upload to complete

3. **Get PDF URLs**
   - Go to **Media** → **Library**
   - Click on each PDF file
   - Copy the **File URL** (right side panel)
   - Example: `https://yoursite.com/wp-content/uploads/2026/01/book-name.pdf`

4. **Update Your Code**
   - Open `app/reader/[id]/page.tsx`
   - Replace the sample URLs with your WordPress URLs
   ```typescript
   "1": {
     title: "Anta Mahboobi",
     author: "Makhdoom Jameel Zaman",
     pdfUrl: "https://yoursite.com/wp-content/uploads/2026/01/anta-mahboobi.pdf",
   },
   ```

### Method 2: Using a Plugin

**Recommended Plugin: FileBird or WP Media Folder**
- Better organization with folders
- Bulk upload support
- Easy URL copying

---

## 🔧 WordPress Configuration for PDFs

### Enable CORS (if needed)

If you get CORS errors, add this to your WordPress `.htaccess` file:

```apache
<FilesMatch "\.(pdf)$">
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type"
</FilesMatch>
```

Or add this to your theme's `functions.php`:

```php
function add_cors_http_header(){
    if (strpos($_SERVER['REQUEST_URI'], '.pdf') !== false) {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, OPTIONS");
    }
}
add_action('init','add_cors_http_header');
```

### Increase Upload Size Limit

If your PDFs are large, increase upload limits:

**In `.htaccess`:**
```apache
php_value upload_max_filesize 50M
php_value post_max_size 50M
php_value max_execution_time 300
```

**Or in `wp-config.php`:**
```php
@ini_set('upload_max_filesize', '50M');
@ini_set('post_max_size', '50M');
@ini_set('max_execution_time', '300');
```

---

## 📝 Example URL Structure

**Typical WordPress PDF URLs:**
```
https://yoursite.com/wp-content/uploads/2026/01/filename.pdf
https://yoursite.com/wp-content/uploads/2026/01/books/filename.pdf
```

**With CDN (if enabled):**
```
https://cdn.yoursite.com/wp-content/uploads/2026/01/filename.pdf
```

---

## 🔐 Security Considerations

### Public vs. Private PDFs

**Public PDFs (Current Setup):**
- Anyone with the URL can access
- No authentication required
- Best for open-access library

**Private PDFs (Future Enhancement):**
- Require user login
- Use WordPress REST API with JWT tokens
- Add authentication to your app

### File Permissions

Ensure PDF files have correct permissions:
- Files: `644` (readable by everyone)
- Directories: `755`

---

## 🚀 Quick Start Checklist

- [ ] Upload all PDFs to WordPress Media Library
- [ ] Copy the File URL for each PDF
- [ ] Update `app/reader/[id]/page.tsx` with WordPress URLs
- [ ] Also update `components/BooksCollection.tsx` with same URLs
- [ ] Test each book link to ensure PDFs load
- [ ] Check browser console for any CORS errors
- [ ] If CORS errors occur, add headers (see above)

---

## 📋 Code Update Template

### In `app/reader/[id]/page.tsx`:

```typescript
const bookData: Record<string, { title: string; pdfUrl: string; author: string }> = {
  "1": {
    title: "Anta Mahboobi",
    author: "Makhdoom Jameel Zaman",
    pdfUrl: "YOUR_WORDPRESS_URL_HERE", // ← Replace this
  },
  "2": {
    title: "The Genealogies (Al-Ansab)",
    author: "Makhdoom Jameel Zaman",
    pdfUrl: "YOUR_WORDPRESS_URL_HERE", // ← Replace this
  },
  // ... and so on
};
```

### In `components/BooksCollection.tsx`:

```typescript
const books = [
  {
    id: 1,
    title: "Anta Mahboobi",
    pdfPath: "YOUR_WORDPRESS_URL_HERE", // ← Replace this
  },
  // ... and so on
];
```

**IMPORTANT:** Make sure both files use the **same URLs** for consistency!

---

## 🧪 Testing Your Setup

1. **Upload one test PDF first**
2. **Get its URL from WordPress**
3. **Update book ID "1" with the URL**
4. **Run your app**: `npm run dev`
5. **Click on the first book**
6. **Check if PDF loads successfully**
7. **If successful, upload and configure remaining PDFs**

---

## 🔍 Troubleshooting

### PDF doesn't load
- ✓ Check URL is correct (copy-paste from WordPress)
- ✓ Ensure PDF file exists on WordPress
- ✓ Try opening URL directly in browser
- ✓ Check browser console for errors

### CORS Error
- ✓ Add CORS headers (see configuration above)
- ✓ Contact WordPress hosting support
- ✓ Try different hosting provider if needed

### Slow Loading
- ✓ Optimize PDF file size (compress PDFs)
- ✓ Enable CDN on WordPress
- ✓ Use WordPress caching plugin
- ✓ Consider premium WordPress hosting

---

## 💡 Alternative Hosting Options (If WordPress Doesn't Work)

1. **Google Drive** (with public sharing)
2. **Cloudflare R2** (recommended, free tier available)
3. **AWS S3** (industry standard)
4. **GitHub Pages** (free for public repos)
5. **Vercel Blob Storage** (integrates with Next.js)

---

## 📞 Need Help?

If WordPress PDF hosting doesn't work:
1. Check browser console for specific error messages
2. Share the error with me
3. I'll help you troubleshoot or suggest alternatives

---

**Current Status:** ✅ App is configured to use external URLs. Just replace the sample URLs with your WordPress URLs and you're ready to go!
