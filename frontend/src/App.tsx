// @ts-nocheck
import {
  CircularProgress,
  CssBaseline,
  Stack,
  Box,
  Skeleton,
} from "@mui/material";
import "./App.css";
import Sidebar from "./component/Sidebar";
// import Editor from './component/Editor/Editor';
import Editor from "./component/Editor/Editor";
import { fabric } from "fabric";
import React, { useCallback, useEffect, useState } from "react";
// import api from '../api';
import Header from "./component/Header";
import useRequest from "./hooks/useRequest";
import { grey } from "@mui/material/colors";
import {
  DicomImageMarkup,
  SendMarkup,
  getDicom,
  getDicomImage,
  getDicomImageMarkup,
  sendDicom,
  sendDicomImageMarkup,
} from "./api/dicom";
import styles from "./App.module.scss";

function App() {
  const [canvas, setCanvas] = useState();
  const [contrastValue, setImgContrastValue] = useState(0);
  const [brightnessValue, setImgBrightnessValue] = useState(0);
  const [uploadDicomId, setUploadDicomId] = useState<number>();
  const uploadDicom = useRequest<{ dicomId: number }>();
  const requestImgId = useRequest<{
    dicomId: number;
    imagesNumber: number;
    modality: string;
  }>();
  const requestImg = useRequest<{ dicomId: number; imageId: number }>();
  const dicomImageMarkup = useRequest<DicomImageMarkup>();
  const sendMarkup = useRequest<SendMarkup>();

  // Отправка разметки.
  // sendMarkup.request(sendDicomImageMarkup());

  // && для плавного хода прилодера.
  const loading = !(
    !uploadDicom.isLoading &&
    !requestImgId.isLoading &&
    !requestImg.isLoading
  );

  // Загрузка диком на сервер.
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      event.target.files[0].arrayBuffer().then((arrayBuffer) => {
        const blob = new Blob([new Uint8Array(arrayBuffer)], {
          type:
            event.target.files && event.target.files[0]
              ? event.target.files[0].type
              : undefined,
        });
        blob && uploadDicom.request(() => sendDicom(blob));
      });
    }
  }

  const requestDicomData = useCallback(
    async (dicomId: number) => {
      if (dicomId) {
        await requestImgId.request(() => getDicom(dicomId));
        await requestImg.request(() => getDicomImage(dicomId, 0));
        await dicomImageMarkup.request(() => getDicomImageMarkup(dicomId, 0));
      }
    },
    [uploadDicom?.data?.dicomId]
  );

  useEffect(() => {
    requestImg.data && loadImage();
  }, [requestImg.data]);

  useEffect(() => {
    const dicomId = uploadDicom?.data?.dicomId;
    requestDicomData(dicomId);
  }, [requestDicomData, uploadDicom.data]);
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
          [selectorXLeftTop, selectorYLeftTop],
          [selectorXRightBottom, selectorYRightBottom],
        ],
      };
    });
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
      if (img.top !== elem.target.top) {
        elem.target.top = img.top;
      }
      if (img.left !== elem.target.left) {
        elem.target.left = img.left;
      }
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
      console.log("yep");
    }
  };
  const changeInterceptionCoordinates = () => {};

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
  const dZoom = debounce(zoom);
  useEffect(() => {
    if (canvas) {
      //todo debounce
      canvas.on({
        "object:moving": onCanvasChange,
        "object:rotating": onImgChange,
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
      canvas.on("mouse:wheel", dZoom);
    }
  }, [canvas]);
  useEffect(() => {
    const canvas = new fabric.Canvas("my-fabric-canvas", {
      preserveObjectStacking: true,
    });

    setCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);
  const deleteObjects = () => {
    canvas.getObjects().forEach(function (o) {
      if (o.myId !== "myimg") {
        canvas.remove(o);
      }
    });
  };
  const deleteLastObject = () => {
    const objects = canvas.getObjects();
    const lastObject = objects[objects.length - 1];
    if (lastObject.myId !== "myimg") canvas.remove(lastObject);
  };

  const loadImage = () => {
    const img = getImage(requestImg.data);
    if (img) return;
    fabric.Image.fromURL(requestImg.data, function (img) {
      img.set({
        myId: "myimg",
        lockMovementY: true,
        lockMovementX: true,
        selectable: false,
      });
      canvas.centerObject(img);
      canvas.add(img);
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
        lockRotation: true,
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
        lockRotation: true,
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

  // Кладём айди из инпута в стэйт для дальнейшего поиска дикома
  const handleChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    setUploadDicomId(event.target.value);
  };

  const loadDicom = () => {
    requestDicomData(uploadDicomId);
  };

  return (
    <div className="App">
      <CssBaseline />
      <Sidebar
        miniature={
          <Stack minHeight="calc(100vh - 150px)" alignItems="center">
            {loading ? (
              <Skeleton
                sx={{ bgcolor: grey[800], margin: "20px 8px" }}
                animation="wave"
                variant="rectangular"
                width={220}
                height={150}
              />
            ) : (
              <Box
                sx={{
                  bgcolor: grey[800],
                  width: 220,
                  height: 150,
                  margin: "20px 8px",
                }}
              >
                <img className={styles.img} src={requestImg.data} alt="" />
              </Box>
            )}
          </Stack>
        }
      >
        <Header
          handleChange={handleChange}
          addRect={addRect}
          addCircle={addCircle}
          addLine={addLine}
          loadDicom={loadDicom}
          getObjects={getObjects}
          getInterceptions={getInterceptions}
          clearImgFilters={clearImgFilters}
          handleRange={handleRange}
          contrastValue={contrastValue}
          brightnessValue={brightnessValue}
          deleteObjects={deleteObjects}
          deleteLastObject={deleteLastObject}
          handleChangeInput={handleChangeInput}
        />
        {loading && (
          <Stack
            minHeight="calc(100vh - 150px)"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress />
          </Stack>
        )}
        <Editor />
      </Sidebar>
    </div>
  );
}

export default App;
