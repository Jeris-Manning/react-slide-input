import React, { useLayoutEffect, useRef, useCallback } from "react";
import styled from "styled-components";

const getPercentage = (current, max) => (100 * current) / max;
const getValue = (percentage, max) => (max / 100) * percentage;
const getWidth = (percentage) => `${percentage}%`;

const Slider = ({ startVal, maxVal, onChange, gripImage }) => {
  const initialPercentage = getPercentage(startVal, maxVal);

  const wrapRef = useRef();
  const sliderRef = useRef();
  const rangeRef = useRef();
  const gripRef = useRef();
  const currentRef = useRef();

  const diff = useRef();

  const getLeft = (percentage) =>
    `calc(${percentage}% - ${gripRef.current.offsetWidth / 2}px)`;

  const handleUpdate = useCallback((value, percentage) => {
    gripRef.current.style.left = getLeft(percentage);
    rangeRef.current.style.width = getWidth(percentage);
    currentRef.current = value;
    wrapRef.current.style.height = `${gripRef.current.offsetHeight}px`;
    gripRef.current.style.top = `-${
      (gripRef.current.offsetHeight - sliderRef.current.offsetHeight) / 2
    }px`;
  }, []);

  const handleMouseMove = (e) => {
    let newX =
      e.clientX - diff.current - sliderRef.current.getBoundingClientRect().left;

    const end = sliderRef.current.offsetWidth - gripRef.current.offsetWidth;

    const start = 0;

    if (newX < start) {
      newX = 0;
    }

    if (newX > end) {
      newX = end;
    }

    const newPercentage = getPercentage(newX, end);
    const newValue = getValue(newPercentage, maxVal);

    handleUpdate(newValue, newPercentage);

    onChange(newValue);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
  };

  const handleMouseDown = (e) => {
    diff.current = e.clientX - gripRef.current.getBoundingClientRect().left;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useLayoutEffect(() => {
    handleUpdate(startVal, initialPercentage);

    // console.log(wrapRef.current);
  }, [startVal, initialPercentage, handleUpdate]);

  return (
    <SlideWrapper ref={wrapRef}>
      <SliderTrack ref={sliderRef}>
        <RangeTrack ref={rangeRef} />
        <Grip
          onDragStart={() => false}
          draggable="false"
          src={gripImage}
          ref={gripRef}
          onMouseDown={handleMouseDown}
        />
      </SliderTrack>
    </SlideWrapper>
  );
};

export default Slider;

const SlideWrapper = styled.div.attrs((props) => ({
  sliderWidth: props.sliderWidth || "100%",
  sliderHeight: props.slidedrHeight || "20px",
}))`
  display: flex;
  position: relative;
  align-items: center;
  user-select: none;
  width: ${(props) => props.sliderWidth};
  height: ${(props) => props.sliderHeight};
`;

const SliderTrack = styled.div.attrs((props) => ({
  sliderHeight: props.sliderHeight || "12px",
  sliderRadius: props.sliderRadius || "2px",
  sliderColor: props.sliderColor || "rgba(0, 200, 240, .5)",
}))`
  position: relative;
  width: 100%;
  user-select: none;
  height: ${(props) => props.sliderHeight};
  background-color: ${(props) => props.sliderColor};
  border-radius: ${(props) => props.sliderRadius};
`;

const RangeTrack = styled.div.attrs((props) => ({
  rangeColor: props.rangeColor || "purple",
  rangeWidth: props.rangeWidth || "40%",
  rangeRadius: props.rangeRadius || "2px",
}))`
  position: absolute;
  height: 100%;
  user-select: none;
  background-color: ${(props) => props.rangeColor};
  width: ${(props) => props.rangeWidth};
  border-radius: ${(props) => props.rangeRadius};
`;

const Grip = styled.img.attrs((props) => ({
  width: props.width || "maxContent",
  height: props.height || "maxContent",
  grabbing: props.grabbing || "grab",
}))`
  top: -10px;
  position: relative;
  z-index: 2;
  user-select: none;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: ${(props) => props.grabbing};
`;
