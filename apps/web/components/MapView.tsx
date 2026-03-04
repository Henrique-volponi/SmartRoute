/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import type { Map } from 'leaflet'
import { StopPoint } from '../types/route'

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  {
    ssr: false,
  }
) as typeof import('react-leaflet').MapContainer

const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), {
  ssr: false,
}) as typeof import('react-leaflet').TileLayer

const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), {
  ssr: false,
}) as typeof import('react-leaflet').GeoJSON

const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
  ssr: false,
}) as typeof import('react-leaflet').Marker

const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
  ssr: false,
}) as typeof import('react-leaflet').Popup

interface Props {
  geometry?: GeoJSON.Geometry | null
  stops: StopPoint[]
}

export function MapView({ geometry, stops }: Props) {
  const mapRef = useRef<Map | null>(null)
  const [leaflet, setLeaflet] = useState<typeof import('leaflet') | null>(null)

  useEffect(() => {
    import('leaflet').then(mod => setLeaflet(mod))
  }, [])

  const bounds = useMemo(() => {
    if (!leaflet) return undefined

    if (geometry) {
      const layer = leaflet.geoJSON(geometry as any)
      const gBounds = layer.getBounds()
      if (gBounds.isValid()) return gBounds
    }

    if (stops.length) {
      const b = leaflet.latLngBounds(stops.map(s => [s.lat, s.lng]))
      if (b.isValid()) return b
    }

    return undefined
  }, [geometry, stops, leaflet])

  useEffect(() => {
    if (mapRef.current && bounds) {
      mapRef.current.fitBounds(bounds, { padding: [32, 32] })
    }
  }, [bounds])

  const { startIdx, endIdx } = useMemo(() => {
    if (!stops.length) return { startIdx: -1, endIdx: -1 }

    const ordered = stops
      .map((stop, idx) => ({ idx, ord: stop.order }))
      .filter(item => typeof item.ord === 'number' && Number.isFinite(item.ord as number))

    if (!ordered.length) return { startIdx: -1, endIdx: -1 }

    let startIdx = ordered[0].idx
    let endIdx = ordered[0].idx
    let minOrder = ordered[0].ord as number
    let maxOrder = ordered[0].ord as number

    ordered.forEach(item => {
      const ord = item.ord as number
      if (ord < minOrder) {
        minOrder = ord
        startIdx = item.idx
      }
      if (ord > maxOrder) {
        maxOrder = ord
        endIdx = item.idx
      }
    })

    return { startIdx, endIdx }
  }, [stops])

  const getIcon = (order: number | undefined, isStart: boolean, isEnd: boolean) =>
    leaflet?.divIcon({
      className: 'marker-badge',
      html: `<div style="background:${isStart ? '#1d4ed8' : isEnd ? '#f97316' : '#111827'};color:white;">${
        order ?? '•'
      }</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    })

  return (
    <div className="map-wrap">
      {!leaflet ? (
        <div className="muted" style={{ padding: 16 }}>
          Carregando mapa…
        </div>
      ) : (
        <MapContainer
          ref={instance => {
            mapRef.current = instance
          }}
          style={{ height: '100%', width: '100%' }}
          center={[-23.5614, -46.6558]}
          zoom={13}
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {geometry ? (
            <GeoJSON data={geometry as any} style={{ color: '#22c55e', weight: 4 }} />
          ) : null}

          {stops.map((stop, idx) => (
            <Marker
              key={`${stop.label}-${idx}`}
              position={[stop.lat, stop.lng]}
              icon={
                getIcon(stop.order ?? idx + 1, idx === startIdx, idx === endIdx) ??
                undefined
              }
            >
              <Popup>
                <strong>{stop.label}</strong>
                <br />
                {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  )
}
