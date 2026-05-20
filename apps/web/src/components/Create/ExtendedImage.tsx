'use client';
import React, { useRef } from 'react';
import { Image, ImageProps } from 'primereact/image';
import { useHover } from 'ahooks';

interface ExtendedImageProps extends Omit<ImageProps, 'onClick'> {
    onPreviewClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const ExtendedImage: React.FC<ExtendedImageProps> = ({ onPreviewClick, width, height, ...props }) => {
    const ref = useRef(null);
    const isHovering = useHover(ref);
    const handlePreviewClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (onPreviewClick) {
            onPreviewClick(event);
        }
    };

    return (
        <div
            style={{
                position: 'relative',
                width: width ? `${width}px` : '100%',
                height: height ? `${height}px` : '100%',
                overflow: 'hidden',
            }}
        >
            <Image {...props} preview={false} alt="img" />
            {props.preview && (
                <div
                    ref={ref}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                        backgroundColor: isHovering ? 'rgba(2, 2, 2, 0.70)' : '',
                        objectFit: 'cover',
                        objectPosition: 'center',
                    }}
                    className="flex items-center justify-center"
                    onClick={handlePreviewClick}
                >
                    {isHovering && <i className="pi pi-trash" style={{ color: '#fff', fontSize: 26 }}></i>}
                </div>
            )}
        </div>
    );
};

export default ExtendedImage;
