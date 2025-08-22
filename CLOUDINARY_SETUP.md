# Cloudinary Setup Guide

## 1. Create Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email

## 2. Get Your Credentials

After logging in to your Cloudinary dashboard:

1. **Cloud Name**: Found in the dashboard header (e.g., `abc123`)
2. **Upload Preset**: Go to Settings → Upload → Upload presets
3. Create a new upload preset:
   - Name: `uvhub_uploads`
   - Signing Mode: `Unsigned`
   - Folder: `uvhub`
   - Allowed formats: `jpg, jpeg, png, webp, gif`

## 3. Environment Variables

Add these to your `.env.local` file:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=uvhub_uploads
```

## 4. Install Dependencies

```bash
npm install cloudinary
```

## 5. Test Upload

After setting up, test the upload functionality in the variants creation form.

## Benefits of Cloudinary

- ✅ **Reliable**: 99.9% uptime SLA
- ✅ **Fast**: Global CDN with edge locations
- ✅ **Optimized**: Automatic image optimization and format conversion
- ✅ **Secure**: Built-in security features
- ✅ **Free Tier**: 25GB storage, 25GB bandwidth/month
- ✅ **Easy Setup**: No complex storage policies needed

## Folder Structure

Uploads will be organized as:
- `uvhub/products/` - Product images
- `uvhub/variants/` - Variant images
- `uvhub/avatars/` - User avatars (if needed)

## Security

- Upload preset is unsigned (no API key needed in frontend)
- File type restrictions handled by Cloudinary
- No need to manage storage policies or permissions
