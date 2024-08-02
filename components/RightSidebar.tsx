import { modifyShape } from '@/lib/shapes';
import Color from '@/settings/Color';
import Dimensions from '@/settings/Dimensions';
import Export from '@/settings/Export';
import Text from '@/settings/Text';
import { RightSidebarProps } from '@/types/type';

export const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
}: RightSidebarProps) => {
  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true;

    setElementAttributes((prev) => ({
      ...prev,
      [property]: value,
    }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage,
    });
  };
  return (
    <div className='flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 min-w-[227px] sticky right-0 h-full max-sm:hidden select-none'>
      <h3 className='px-5 pt-4 text-xs uppercase'>Design</h3>
      <span className='text-xs text-primary-grey-300 mt-3 px-5 border-b border-primary-grey-200 pb-4'>
        Make changes to canvas as you like
      </span>

      <Dimensions
        width={elementAttributes.width}
        height={elementAttributes.height}
        handleInputChange={handleInputChange}
        isEditingRef={isEditingRef}
      />
      <Text
        fontFamily={elementAttributes.fontFamily}
        fontSize={elementAttributes.fontSize}
        fontWeight={elementAttributes.fontWeight}
        handleInputChange={handleInputChange}
      />
      <Color />
      <Color />
      <Export />
    </div>
  );
};
