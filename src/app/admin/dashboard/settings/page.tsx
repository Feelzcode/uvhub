/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store';
import { Settings } from '@/store/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Facebook, BarChart3, Globe, Mail } from 'lucide-react';
import { toast } from 'sonner';


export default function SettingsPage() {
    const { settings, loading, error, getSettings, updateSettings } = useSettingsStore();
    const [formData, setFormData] = useState<Partial<Settings>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getSettings();
    }, [getSettings]);

    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    const handleInputChange = (field: keyof Settings, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSettings(formData);
            toast.success('Settings saved successfully!');
        } catch (error) {
            toast.error((error as Error).message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="text-muted-foreground">Loading settings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
                        <p className="text-muted-foreground">
                            Manage your site configuration, analytics, and tracking settings.
                        </p>
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>

                <Tabs defaultValue="analytics" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="general" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            General
                        </TabsTrigger>
                        <TabsTrigger value="contact" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Contact
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="analytics" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Facebook className="h-5 w-5" />
                                    Facebook Pixel
                                </CardTitle>
                                <CardDescription>
                                    Configure Facebook Pixel for tracking conversions and building custom audiences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="facebook-enabled">Enable Facebook Pixel</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Track user behavior and conversions on your website
                                        </p>
                                    </div>
                                    <Switch
                                        id="facebook-enabled"
                                        checked={formData.facebook_pixel_enabled || false}
                                        onCheckedChange={(checked) => handleInputChange('facebook_pixel_enabled', checked)}
                                    />
                                </div>

                                {formData.facebook_pixel_enabled && (
                                    <div className="space-y-2">
                                        <Label htmlFor="facebook-pixel-id">Facebook Pixel ID</Label>
                                        <Input
                                            id="facebook-pixel-id"
                                            placeholder="123456789012345"
                                            value={formData.facebook_pixel_id || ''}
                                            onChange={(e) => handleInputChange('facebook_pixel_id', e.target.value)}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Find your Pixel ID in Facebook Ads Manager under Events Manager
                                        </p>
                                    </div>
                                )}

                                {formData.facebook_pixel_enabled && formData.facebook_pixel_id && (
                                    <Alert>
                                        <AlertDescription>
                                            Facebook Pixel is active and will track the following events:
                                            <ul className="mt-2 list-disc list-inside space-y-1">
                                                <li>PageView - When users visit pages</li>
                                                <li>ViewContent - When users view products</li>
                                                <li>AddToCart - When users add items to cart</li>
                                                <li>Purchase - When users complete orders</li>
                                                <li>Lead - When users sign up</li>
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Google Analytics
                                </CardTitle>
                                <CardDescription>
                                    Configure Google Analytics for website traffic and user behavior tracking.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="ga-enabled">Enable Google Analytics</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Track website traffic and user behavior
                                        </p>
                                    </div>
                                    <Switch
                                        id="ga-enabled"
                                        checked={formData.google_analytics_enabled || false}
                                        onCheckedChange={(checked) => handleInputChange('google_analytics_enabled', checked)}
                                    />
                                </div>

                                {formData.google_analytics_enabled && (
                                    <div className="space-y-2">
                                        <Label htmlFor="ga-id">Google Analytics ID</Label>
                                        <Input
                                            id="ga-id"
                                            placeholder="G-XXXXXXXXXX"
                                            value={formData.google_analytics_id || ''}
                                            onChange={(e) => handleInputChange('google_analytics_id', e.target.value)}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Your Google Analytics 4 Measurement ID (starts with G-)
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="general" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>General Site Settings</CardTitle>
                                <CardDescription>
                                    Configure basic site information and branding.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="site-name">Site Name *</Label>
                                    <Input
                                        id="site-name"
                                        placeholder="UVHub"
                                        value={formData.site_name || ''}
                                        onChange={(e) => handleInputChange('site_name', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="site-description">Site Description</Label>
                                    <Textarea
                                        id="site-description"
                                        placeholder="Your Ultimate Shopping Destination"
                                        value={formData.site_description || ''}
                                        onChange={(e) => handleInputChange('site_description', e.target.value)}
                                        rows={3}
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        This description appears in search results and social media shares
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Contact Information
                                </CardTitle>
                                <CardDescription>
                                    Set up contact information for customer support and inquiries.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contact-email">Contact Email</Label>
                                    <Input
                                        id="contact-email"
                                        type="email"
                                        placeholder="support@uvhub.com"
                                        value={formData.contact_email || ''}
                                        onChange={(e) => handleInputChange('contact_email', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contact-phone">Contact Phone</Label>
                                    <Input
                                        id="contact-phone"
                                        type="tel"
                                        placeholder="+234 123 456 7890"
                                        value={formData.contact_phone || ''}
                                        onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
} 