'use client';

import { Canvas, FabricObject } from 'fabric';

import { LeftSidebar } from '@/components/LeftSidebar';
import { Live } from '@/components/Live';
import Navbar from '@/components/Navbar';
import { RightSidebar } from '@/components/RightSidebar';
import { useEffect, useRef, useState } from 'react';
import {
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleResize,
  initializeFabric,
  renderCanvas,
} from '@/lib/canvas';
import { ActiveElement } from '@/types/type';
import { useMutation, useStorage } from '@/liveblocks.config';
import { defaultNavElement } from '@/constants';
import { handleDelete } from '@/lib/key-events';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<FabricObject | null>(null);
  const selectedShapeRef = useRef<string | null>('rectangle');
  const activeObjectRef = useRef<FabricObject | null>(null);

  const canvasObjects = useStorage((root) => root.canvasObjects);
  console.log('in page', canvasObjects);

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;
    const { objectId } = object;

    const shapeData = object.toJSON();
    shapeData.objectId = objectId;

    const canvasObjects = storage.get('canvasObjects');
    console.log();

    canvasObjects.set(objectId, shapeData);
  }, []);

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '',
    value: '',
    icon: '',
  });

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get('canvasObjects');

    if (!canvasObjects || canvasObjects.size === 0) return true;

    for (const [key, value] of canvasObjects.entries()) {
      canvasObjects.delete(key);
    }
    return canvasObjects.size === 0;
  }, []);

  const deleteShapeFromSrotage = useMutation(({ storage }, objectId) => {
    const canvasObjects = storage.get('canvasObjects');
    canvasObjects.delete(objectId);
  }, []);

  const handleActivateElement = (elem: ActiveElement) => {
    setActiveElement(elem);

    switch (elem?.value) {
      // delete all the shapes from the canvas
      case 'reset':
        // clear the storage
        deleteAllShapes();
        // clear the canvas
        fabricRef.current?.clear();
        // set 'selected' as the active element
        setActiveElement(defaultNavElement);
        break;
      case 'delete':
        handleDelete(fabricRef.current as any, deleteShapeFromSrotage);
        setActiveElement(defaultNavElement);
      default:
        break;
    }

    selectedShapeRef.current = elem?.value as string;
  };

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

    canvas.on('mouse:move', (options) => {
      handleCanvasMouseMove({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage,
      });
    });

    canvas.on('mouse:up', (options) => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
        activeObjectRef,
      });
    });

    canvas.on('object:modified', (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });

    window.addEventListener('resize', () => {
      handleResize({ canvas: fabricRef.current });
    });

    return () => {
      canvas.dispose();
    };

    return () => {
      window.removeEventListener('resize', handleResizeEvent);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [syncShapeInStorage]);

  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    });
  }, [canvasObjects]);

  return (
    <main className='h-screen overflow-hidden'>
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActivateElement}
      />
      <section className='flex h-full flex-row'>
        <LeftSidebar allShapes={Array.from(canvasObjects)} />
        <Live canvasRef={canvasRef} />
        <RightSidebar />
      </section>
    </main>
  );
}
