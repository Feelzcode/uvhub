'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Facebook, Loader2, AlertCircle } from 'lucide-react';
import { useSettingsStore } from '@/store';
import { toast } from 'sonner';

export default function SetupFacebookPixelPage() {
    const [pixelId, setPixelId] = useState('775139811605510');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { settings, updateSettings } = useSettingsStore();

    const handleSetup = async () => {
        if (!pixelId.trim()) {
            toast.error('Please enter a Facebook Pixel ID');
            return;
        }

        setIsLoading(true);
        try {
            await updateSettings({
                ...settings,
                facebook_pixel_id: pixelId.trim(),
                facebook_pixel_enabled: true,
            });
            
            setIsSuccess(true);
            toast.success('Facebook Pixel has been successfully configured!');
        } catch (error) {
            console.error('Error setting up Facebook Pixel:', error);
            toast.error('Failed to configure Facebook Pixel. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable = async () => {
        setIsLoading(true);
        try {
            await updateSettings({
                ...settings,
                facebook_pixel_enabled: false,
            });
            
            setIsSuccess(false);
            toast.success('Facebook Pixel has been disabled.');
        } catch (error) {
            console.error('Error disabling Facebook Pixel:', error);
            toast.error('Failed to disable Facebook Pixel. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Facebook Pixel Setup</h1>
                <p className="text-muted-foreground">
                    Configure Facebook Pixel to track conversions and build custom audiences
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Facebook className="h-5 w-5 text-blue-600" />
                        Quick Setup
                    </CardTitle>
                    <CardDescription>
                        Enter your Facebook Pixel ID to enable tracking on your website
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="pixel-id">Facebook Pixel ID</Label>
                        <Input
                            id="pixel-id"
                            value={pixelId}
                            onChange={(e) => setPixelId(e.target.value)}
                            placeholder="123456789012345"
                            disabled={isLoading}
                        />
                        <p className="text-sm text-muted-foreground">
                            Your Pixel ID is pre-filled. If you need to change it, you can edit it above.
                        </p>
                    </div>

                    {settings?.facebook_pixel_enabled && settings?.facebook_pixel_id && (
                        <Alert>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription>
                                Facebook Pixel is currently active with ID: <strong>{settings.facebook_pixel_id}</strong>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex gap-2">
                        {!settings?.facebook_pixel_enabled ? (
                            <Button 
                                onClick={handleSetup} 
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Setting up...
                                    </>
                                ) : (
                                    <>
                                        <Facebook className="mr-2 h-4 w-4" />
                                        Enable Facebook Pixel
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleDisable} 
                                disabled={isLoading}
                                variant="outline"
                                className="flex-1"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Disabling...
                                    </>
                                ) : (
                                    'Disable Facebook Pixel'
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>What Will Be Tracked</CardTitle>
                    <CardDescription>
                        Once enabled, Facebook Pixel will automatically track these events:
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <strong>PageView:</strong> When users visit pages on your website
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <strong>ViewContent:</strong> When users view product details
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <strong>AddToCart:</strong> When users add items to their cart
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <strong>InitiateCheckout:</strong> When users start the checkout process
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <strong>Purchase:</strong> When users complete orders
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>If you need to find your Facebook Pixel ID:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-4">
                        <li>Go to <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Business Manager</a></li>
                        <li>Navigate to <strong>Events Manager</strong></li>
                        <li>Click <strong>Connect Data Sources</strong></li>
                        <li>Select <strong>Web</strong> and then <strong>Facebook Pixel</strong></li>
                        <li>Copy your Pixel ID (it looks like: 123456789012345)</li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    );
}
