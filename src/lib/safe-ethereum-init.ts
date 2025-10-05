/**
 * Safe Ethereum initialization to prevent extension conflicts
 * This script runs before any other scripts to ensure ethereum is properly configured
 */

(function safeEthereumInit() {
    if (typeof window === 'undefined') return;

    // Store original ethereum if it exists
    const originalEthereum = (window as any).ethereum;
    
    // Create a safe ethereum proxy
    const createSafeEthereumProxy = (target: any) => {
        return new Proxy(target || {}, {
            get(target, prop) {
                try {
                    if (prop === 'on') {
                        // Return a safe event listener function
                        return function(event: string, callback: Function) {
                            try {
                                if (target && typeof target.on === 'function') {
                                    return target.on(event, callback);
                                }
                                // If target doesn't have 'on' method, create a mock
                                console.warn(`Ethereum provider doesn't support 'on' method for event: ${event}`);
                                return () => {}; // Return no-op unsubscribe function
                            } catch (error) {
                                console.warn(`Error setting up ethereum event listener for ${event}:`, error);
                                return () => {}; // Return no-op unsubscribe function
                            }
                        };
                    }
                    
                    const value = target[prop];
                    if (typeof value === 'function') {
                        return value.bind(target);
                    }
                    return value;
                } catch (error) {
                    console.warn(`Error accessing ethereum.${String(prop)}:`, error);
                    return undefined;
                }
            },
            set(target, prop, value) {
                try {
                    target[prop] = value;
                    return true;
                } catch (error) {
                    console.warn(`Error setting ethereum.${String(prop)}:`, error);
                    return false;
                }
            }
        });
    };

    // Try to safely configure ethereum property
    try {
        // First, try to delete the existing property
        try {
            delete (window as any).ethereum;
        } catch (e) {
            // Ignore deletion errors
        }

        // Create safe ethereum proxy
        const safeEthereum = createSafeEthereumProxy(originalEthereum);

        // Define the ethereum property with safe getter/setter
        Object.defineProperty(window, 'ethereum', {
            get: () => safeEthereum,
            set: (value) => {
                try {
                    // Update the proxy target
                    const newSafeEthereum = createSafeEthereumProxy(value);
                    Object.defineProperty(window, 'ethereum', {
                        get: () => newSafeEthereum,
                        set: (newValue) => {
                            const newerSafeEthereum = createSafeEthereumProxy(newValue);
                            Object.defineProperty(window, 'ethereum', {
                                get: () => newerSafeEthereum,
                                set: (v) => {
                                    // Recursive setter to handle future updates
                                    const recursiveSafeEthereum = createSafeEthereumProxy(v);
                                    Object.defineProperty(window, 'ethereum', {
                                        get: () => recursiveSafeEthereum,
                                        set: (val) => {
                                            // Final fallback - just store the value
                                            (window as any)._ethereum = val;
                                        },
                                        configurable: true,
                                        enumerable: true
                                    });
                                },
                                configurable: true,
                                enumerable: true
                            });
                        },
                        configurable: true,
                        enumerable: true
                    });
                } catch (error) {
                    console.warn('Error updating ethereum property:', error);
                }
            },
            configurable: true,
            enumerable: true
        });

        console.log('Safe Ethereum initialization completed');
    } catch (error) {
        console.warn('Safe Ethereum initialization failed:', error);
        
        // Fallback: just make it writable
        try {
            Object.defineProperty(window, 'ethereum', {
                value: originalEthereum,
                writable: true,
                configurable: true,
                enumerable: true
            });
        } catch (fallbackError) {
            console.warn('Ethereum fallback configuration failed:', fallbackError);
        }
    }
})();
