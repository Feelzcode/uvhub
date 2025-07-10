'use client';

import { useCurrency } from '@/store/hooks/useCurrency';
import { Loader2, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CurrencyDisplay() {
    const {
        location,
        loading,
        error,
        getCurrentCurrencyInfo,
        detectLocation,
        isInNigeria,
        isInGhana,
    } = useCurrency();

    const currencyInfo = getCurrentCurrencyInfo();

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Detecting location...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2">
                <div className="text-sm text-red-600">
                    <span>Location error: {error}</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={detectLocation}
                    className="h-6 px-2"
                >
                    <RefreshCw className="w-3 h-3" />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
                {location?.city && `${location.city}, `}
                {location?.country}
            </span>
            <span className="text-gray-400">•</span>
            <span className="font-medium">
                {currencyInfo.symbol} {currencyInfo.code}
            </span>
            {isInNigeria() && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Nigeria
                </span>
            )}
            {isInGhana() && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Ghana
                </span>
            )}
        </div>
    );
} 