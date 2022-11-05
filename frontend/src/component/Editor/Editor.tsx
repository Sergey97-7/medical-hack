// @ts-nocheck
import { fabric } from "fabric";
import React, { useCallback, useEffect, useState } from "react";
// import api from '../api';
import Header from "../Header";

const Editor = () => {
  const [canvas, setCanvas] = useState();
  const [contrastValue, setImgContrastValue] = useState(0);
  const [brightnessValue, setImgBrightnessValue] = useState(0);
  // const [dicoms, setDicoms] = useState();

  // useEffect(() => {
  //   getDicomImage()

  // }, [])
  // console.log('dicoms', dicoms)

  // const getDicomImage = async () => {
  //   try {
  //     const dicom = await api.dicom.getDicom(111)
  //     console.log('dicom', dicom)
  //     const img = await api.dicom.getDicomImage(dicom.images[0])
  //   } catch (e) {
  //     console.error('getDicom error: ', e)
  //   }
  // }

  const getImage = useCallback(() => {
    const img = canvas.getObjects().find(function (o) {
      return o.myId === "myimg";
    });
    return img;
  }, [canvas]);
  const getInterceptions = () => {
    const img = getImage();
    //TODO только пересечения, если объект не полностью на картинке, то он тоже должен туда попасть ?? updated: пока не попадает, тк запрет на перемещение
    const selectors = canvas.getObjects().filter(function (o) {
      return o.intersectsWithObject(img) && o.myId !== "myimg";
    });

    const markups = selectors.map((item) => {
      const selectorXLeftTop = (item.left - img.left) / img.width;
      const selectorYLeftTop = (item.top - img.top) / img.height;

      const selectorXRightBottom =
        (item.left - img.left + item.width) / img.width;
      const selectorYRightBottom =
        (item.top - img.top + item.height) / img.height;
      return {
        type: item.type,
        geometry: [
          { x: selectorXLeftTop, y: selectorYLeftTop },
          { x: selectorXRightBottom, y: selectorYRightBottom },
        ],
      };
    });
    console.log("markups", markups);
    console.log(selectors);
  };
  /**
   * Запрет на перемещение фигур вне картинки
   * @param elem
   */
  const onCanvasChange = (elem) => {
    const img = getImage();
    if (elem.target.myId === "myimg") {
      //don't work ???
      // elem.lockMovementX = true;
      // elem.lockMovementY = true;
      // if (img.top !== elem.target.top) {
      //   elem.target.top = img.top;
      // }
      // if (img.left !== elem.target.left) {
      //   elem.target.left = img.left;
      // }
      const CANVAS_IMG_BORDER = 20;
      if (img.top < CANVAS_IMG_BORDER) {
        elem.target.top = CANVAS_IMG_BORDER
      }
      if (img.left < CANVAS_IMG_BORDER) {
        elem.target.left = CANVAS_IMG_BORDER;
      }
      if (img.left + img.width - CANVAS_IMG_BORDER > canvas.width) {
        img.left = canvas.width - img.width - CANVAS_IMG_BORDER
      }
      if (img.top + img.height - CANVAS_IMG_BORDER > canvas.height) {
        img.top = canvas.height - img.height - CANVAS_IMG_BORDER
      }

      // const a = {scaleX: img.getScaledWidth(), scaleY: img.getScaledHeight(), skewX: img.getSkewX(), skewY: img.getSkewY(), flipX: img.getFlipX(), flipY:img.getFlipX(), angle: img.getAngle()};
      // selectors.forEach((item)=> {
      //   console.log('item', item)
      //   fabric.util.resetObjectTransform(item);      
      //   item.addWithUpdate();
      //   item.setSkewX(a.skewX);
      //   item.setSkewY(a.skewY);
      //   item.setFlipX(a.flipX);
      //   item.setFlipY(a.flipY);
      //   item.setAngle(a.angle);
      //   item.setScaleX(a.scaleX);
      //   item.setScaleY(a.scaleY);
      // })




    } else {
      if (elem.target.top < img.top) {
        elem.target.top = img.top;
      }
      if (elem.target.left < img.left) {
        elem.target.left = img.left;
      }
      if (elem.target.left + elem.target.width > img.left + img.width) {
        elem.target.left = img.left + img.width - elem.target.width;
      }
      if (elem.target.top + elem.target.height > img.top + img.height) {
        elem.target.top = img.top + img.height - elem.target.height;
      }
    }
  };
  const onImgChange = (e) => {
    if (e.target.myId === "myimg") {
      console.log("yep", e);
      const selectors = canvas.getObjects().filter(function (o) {
        return o.intersectsWithObject(e.target) && o.myId !== "myimg";
      });
      let scaleY = e.transform.scaleY !== 1 ? e.transform.scaleY : null
      let scaleX = e.transform.scaleX !== 1 ? e.transform.scaleX : null
      selectors.forEach((item) => {
        if (scaleY) {
          item.scaleY = scaleY
          item.width = item.width * scaleY
        }
        if (scaleX) item.scaleX = scaleX
      })
      console.log('scaleY', scaleY)
      // canvas.requestRenderAll();
    }
  };
  const changeInterceptionCoordinates = () => { };

  function zoom(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();

    zoom *= 0.999 ** delta;
    if (zoom > 15) zoom = 15;
    if (zoom < 0.5) zoom = 0.5;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
    //todo ?
    // var vpt = canvas.viewportTransform;
    // if (zoom < 400 / 1000) {
    //   vpt[4] = 200 - 1000 * zoom / 2;
    //   vpt[5] = 200 - 1000 * zoom / 2;
    // } else {
    //   if (vpt[4] >= 0) {
    //     vpt[4] = 0;
    //   } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
    //     vpt[4] = canvas.getWidth() - 1000 * zoom;
    //   }
    //   if (vpt[5] >= 0) {
    //     vpt[5] = 0;
    //   } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
    //     vpt[5] = canvas.getHeight() - 1000 * zoom;
    //   }
    // }
  }
  function debounce(func, timeout = 10) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }
  const onClick = (e) => {
    console.log('DAAAA', e)
    canvas.discardActiveObject();
    console.log('DAAAA', e)
    // console.log('DAAAA', && !canvas.getActiveObject().find(item => item.myId === 'myimg'))
    // console.log('DAAAA', canvas.getActiveObject().myId === 'myimg')
    console.log('canvas.getActiveObject()', canvas.getActiveObjects())
    // console.log('!canvas.getActiveObject().myId === "myimg"', canvas.getActiveObject().myId === 'myimg')
    // console.log('!canvas.getActiveObject().myId === "myimg"', canvas.getActiveObject().get('type') === 'group')
    // console.log('!canvas.getActiveObject().myId === "myimg"', canvas.getActiveObject().canvas.find(item=>item.myId==='myimg'))
    if (e.target && e.target.myId === 'myimg') {
      // if (e.selected && e.selected[0].myId === 'myimg') {

      // canvas.discardActiveObject();



console.log('YEEEP')
      //canvas.getObjects()
      // const selectors = canvas.getObjects().filter(function (o) {
      //   return o.intersectsWithObject(e.target) && o.myId !== "myimg";
      // });
      // const sel = new fabric.ActiveSelection([getImage(), ...selectors], {
      const sel = new fabric.ActiveSelection(canvas.getObjects(), {
        canvas: canvas,

      });


      canvas.setActiveObject(sel);
      canvas.requestRenderAll();
      throw new Error()
      // canvas.centerObject(sel);
      // canvas.setActiveObject(sel);
      // e.e.preventDefault();
      // e.e.stopPropagation();
      // return
      // canvas.requestRenderAll();
    }
    // else return
    // else if (e.target && e.target.myId !== 'myimg') {
    // canvas.discardActiveObject();
    // canvas.requestRenderAll();
    // if (!canvas.getActiveObject()) {
    // return;
    // }
    // if (canvas.getActiveObject().type !== 'group') {
    // return;
    // }
    // canvas.getActiveObject().toActiveSelection();
    // canvas.requestRenderAll();
    // }
  }
  const onClick2 = (e) => {
    console.log('e', e)
    ungroup();
    canvas.remove(rect);
    group.addWithUpdate(rect);
    rect.sendToBack();
    group.set("dirty", true);
    canvas.renderAll();
  }
  function ungroup() {
    group.forEachObject((i) => {
      if (i.type == "rect") {
        group.removeWithUpdate(i);
        canvas.add(i);
      }
    });
  }
  function group() {
    ungroup();
    canvas.remove(rect);
    group.addWithUpdate(rect);
  }
  const dZoom = debounce(zoom);
  const test = (e) => {
    console.log('selected', e)
  }
  useEffect(() => {
    if (canvas) {
      //todo debounce
      canvas.on({
        // "object:moving": onCanvasChange, //TODO FIXXXX
        // 'mouse:down': onClick,
        // 'mousedown': onClick,
        // 'mouse:down': onClick2,
        // 'mouse:dblclick': ()=>{},
        // 'selection:created': onClick,
        // 'mouse:dblclick': ()=>{},
        // 'selection:updated': onClick,
        // 'selection:created': onClick,
        "mouse:wheel": dZoom,
        // "object:rotating": onImgChange,
        // "object:scale": onImgChange,
        // 'object:scaling': onImgChange,
        // 'object:skewing': onImgChange,
        // 'object:resizing': onImgChange,
        // 'object:rotate': onImgChange,
      });
      // canvas.on('mouse:wheel', function(opt) {
      //   var delta = opt.e.deltaY;
      //   var zoom = canvas.getZoom();
      //   zoom *= 0.999 ** delta;
      //   if (zoom > 20) zoom = 20;
      //   if (zoom < 0.01) zoom = 0.01;
      //   canvas.setZoom(zoom);
      //   opt.e.preventDefault();
      //   opt.e.stopPropagation();
      // })
      //TODO fix
      // canvas.on("mouse:wheel", dZoom);

    }
    return () => {
      if (canvas) {
        canvas.off('mouse:down');
        canvas.off("mouse:wheel");
        canvas.off("object:moving")
        canvas.off("selection:created")
        canvas.off("mousedown")
        canvas.off("selection:updated")
        canvas.off("selection:created")
        // canvas.off({
        //   'mouse:down': onClick
        // })
      }
    }
  }, [canvas]);
  useEffect(() => {
    const canvas = new fabric.Canvas("my-fabric-canvas", {
      //TODO ???
      // preserveObjectStacking: true,
    });

    setCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const loadImage = () => {
    const img = getImage();
    if (img) return;
    fabric.Image.fromURL("../img/mrt.jpeg", function (img) {
      // img.set({ myId: "myimg", lockMovementY: true, lockMovementX: true });
      img.set({ myId: "myimg", selection: false, selectable: false });
      canvas.centerObject(img);
      canvas.add(img);
      // img.on('mousedown', onClick)
      img.on('mousedown:before', onClick)
      // img.on('mousedown:before', onClick)


      // todo add background image ?
      // canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      // scaleX: canvas.width / img.width,
      // scaleY: canvas.height / img.height
      // });
    });
  };
  const addRect = () => {
    const img = getImage();
    if (!img) return;
    //todo инициализация по центру картинки ?
    canvas.add(
      new fabric.Rect({
        top: img.top + 100,
        left: img.left + 100,
        width: 100,
        height: 100,
        fill: "rgba(255, 255, 255, 0.0)",
        stroke: "red",
        type: "rect",
      })
    );
  };

  const addCircle = () => {
    const img = getImage();
    if (!img) return;
    //todo инициализация по центру картинки ?
    canvas.add(
      new fabric.Circle({
        top: img.top + 100,
        left: img.left + 100,
        radius: 50,
        fill: "rgba(255, 255, 255, 0.0)",
        stroke: "green",
        type: "circle",
      })
    );
  };
  const addLine = () => {
    const img = getImage();
    if (!img) return;
    //todo инициализация по центру картинки ?
    canvas.add(
      new fabric.Line([50, 50, 100, 100], {
        top: img.top + 100,
        left: img.left + 100,
        stroke: "purple",
      })
    );
  };
  const addRuler = () => {
    const img = getImage();
    if (!img) return;

    canvas.add(
      new fabric.Line(
        [
          measurementThickness - tickSize,
          location1,
          measurementThickness,
          location1,
        ],
        { stroke: "#888", selectable: false }
      )
    );
    canvas.add(
      new fabric.Text(count + '"', {
        left: measurementThickness - tickSize * 2 - 7,
        top: location1,
        fontSize: 12,
        fontFamily: "san-serif",
      })
    );
  };

  const getObjects = () => {
    canvas.getObjects().forEach(function (o) {
      console.log(o);
    });
  };
  const setImgFilters = useCallback(() => {
    const img = getImage();
    if (img) {
      img.filters = [];
      img.filters.push(
        new fabric.Image.filters.Contrast({ contrast: contrastValue })
      );
      img.filters.push(
        new fabric.Image.filters.Brightness({ brightness: brightnessValue })
      );
      img.applyFilters();
      canvas.requestRenderAll();
    }
  }, [brightnessValue, canvas, contrastValue, getImage]);

  const clearImgFilters = () => {
    setImgContrastValue(0);
    setImgBrightnessValue(0);
  };

  const handleRange = (name) => (e) => {
    if (name === "contrast") setImgContrastValue(+e.target.value);
    else if (name === "brightness") setImgBrightnessValue(+e.target.value);
  };

  useEffect(() => {
    if (canvas) {
      setImgFilters();
    }
  }, [brightnessValue, canvas, contrastValue, setImgFilters]);

  return (
    <div>
      <Header
        addRect={addRect}
        addCircle={addCircle}
        addLine={addLine}
        loadImage={loadImage}
        getObjects={getObjects}
        getInterceptions={getInterceptions}
        clearImgFilters={clearImgFilters}
        handleRange={handleRange}
        contrastValue={contrastValue}
        brightnessValue={brightnessValue}
      />
      <canvas id="my-fabric-canvas" width={window.innerWidth - 250} height={window.innerHeight - 64} />
    </div>
  );
};

export default Editor;

//todo
/**
 * Если мы добавляем новый элемент, то мы должны найти все пересечения (getInterceptions)
 * и вывести их боковым списком с возможностью добавить мета теги.
 * Или можно добавлять теги при клике на область, вызывая popover, а в боковой менюшке отображать все это
 */

/**
 * Добавить компонент с запросом списка dicom с бэка и их отображением
 */

/**
 * Образовательная часть (библиотека)
 * Пользователь заходит на вебку и видит боковое меню с категориями голова/легкие или по болезням /categories
 * Далее получает таблицу с поиском и пагинацей
 *
 * Загрузить новый dicom
 *
 * Мои dicom
 */

/**
 * Редактор
 * Загрузчик
 * Боковая панель
 * Верхняя панель
 */

/**
 * TODO list
 * блокировать добавление фигур без картинки - done
 * блокировать перемещение фигур за картинку - done
 * привязывать координаты фигур к картинке
 * блокировать передвижение картинки? только rotate? done
 * фигуры всегда выше картинки (zIndex) - done
 * zoomIn, zoomOut - done
 * яркость - done
 * контрастность - done
 * круг
 * линия
 * запретить движение картинки вне канваса - done?
 */
/**
 * наверно надо хранить ссылки на элементы, а не каждый раз за ними ходить в canvas
 */

/**
 * TODO
 * max img width and height
 */