import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'TaskTracker',
        short_name: 'TaskTracker',
        description: 'A daily task tracking application',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#9333ea',
        icons: [
            {
                src: '/assets/192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/assets/256.png',
                sizes: '256x256',
                type: 'image/png',
            },
            {
                src: '/assets/384.png',
                sizes: '384x384',
                type: 'image/png',
            },
            {
                src: '/assets/512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
