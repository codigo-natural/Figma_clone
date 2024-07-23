'use client';

import { Canvas, FabricObject } from 'fabric';

import { LeftSidebar } from '@/components/LeftSidebar';
import { Live } from '@/components/Live';
import Navbar from '@/components/Navbar';
import { RightSidebar } from '@/components/RightSidebar';
import { useEffect, useRef } from 'react';
import {
  handleCanvasMouseDown,
  handleResize,
  initializeFabric,
} from '@/lib/canvas';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<FabricObject | null>(null);
  const selectedShapeRef = useRef<string | null>('rectangle');

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    const handleResizeEvent = () => handleResize({ fabricRef });
    window.addEventListener('resize', handleResizeEvent);

    canvas.on('mouse:down', (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      });
    });

    return () => {
      window.removeEventListener('resize', handleResizeEvent);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  return (
    <main className='h-screen overflow-hidden'>
      <Navbar />
      <section className='flex h-full flex-row'>
        <LeftSidebar />
        <Live canvasRef={canvasRef} />
        <RightSidebar />
      </section>
    </main>
  );
}
