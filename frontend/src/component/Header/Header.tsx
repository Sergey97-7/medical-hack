import {
  AppBar,
  Toolbar,
  ButtonGroup,
  Button,
  Typography,
  Slider,
  Stack,
  TextField,
  Box,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import LoadingButton from "@mui/lab/LoadingButton";
import styles from "./Header.module.scss";

const drawerWidth = 240;
const buttonStyle = { color: grey[400], borderColor: grey[400] };

interface HeaderProps {
  addRect: () => void;
  addCircle: () => void;
  addLine: () => void;
  loadDicom: () => void;
  getObjects: () => void;
  getInterceptions: () => void;
  clearImgFilters: () => void;
  handleRange: (name: string) => () => void;
  contrastValue: number;
  brightnessValue: number;
  handleChange: () => void;
  deleteObjects: () => void;
  deleteLastObject: () => void;
  handleChangeInput: () => void;
}

export function Header({
  addRect,
  addCircle,
  addLine,
  loadDicom,
  getObjects,
  getInterceptions,
  clearImgFilters,
  handleRange,
  contrastValue,
  brightnessValue,
  handleChange,
  deleteObjects,
  deleteLastObject,
  handleChangeInput,
}: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar
        sx={{ bgcolor: grey[800], display: "flex", alignItems: "center" }}
      >
        <Stack
          width="100%"
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button size="small" sx={buttonStyle} onClick={addRect}>
              квадрат
            </Button>
            <Button size="small" sx={buttonStyle} onClick={addCircle}>
              круг
            </Button>
            <Button size="small" sx={buttonStyle} onClick={addLine}>
              линейка
            </Button>
          </ButtonGroup>
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button size="small" sx={buttonStyle} onClick={deleteLastObject}>
              Удалить последний
            </Button>
            <Button size="small" sx={buttonStyle} onClick={deleteObjects}>
              Удалить все
            </Button>
          </ButtonGroup>
          <div className={styles.mainSlider}>
            <div className={styles.nameSlider}>
              <Typography
                sx={{ ...buttonStyle, marginRight: 2 }}
                variant="body2"
              >
                КОНТРАСТ:
              </Typography>
              <Typography
                sx={{ ...buttonStyle, marginRight: 2 }}
                variant="body2"
              >
                ЯРКОСТЬ:
              </Typography>
            </div>
            <div className={styles.sliderContainer}>
              <Slider
                onChange={handleRange("contrast")}
                value={contrastValue}
                min={-0.9}
                max={0.9}
                step={0.05}
                aria-label="Slider"
                valueLabelDisplay="off"
                size="small"
              />
              <Slider
                value={brightnessValue}
                onChange={handleRange("brightness")}
                min={-0.9}
                max={0.9}
                step={0.05}
                aria-label="Slider"
                valueLabelDisplay="off"
                size="small"
              />
            </div>
            <Button onClick={clearImgFilters}>Сбросить</Button>
          </div>
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <LoadingButton
              component="label"
              variant="contained"
              size="small"
              sx={buttonStyle}
            >
              Загрузить
              <input
                id="dicom"
                name="dicom"
                hidden
                accept="dicom/*"
                type="file"
                onChange={handleChange}
              />
            </LoadingButton>
            <LoadingButton
              component="label"
              variant="contained"
              size="small"
              sx={buttonStyle}
              onClick={getInterceptions}
            >
              Разметка
            </LoadingButton>
          </ButtonGroup>
          <Box
            sx={{
              border: `solid ${grey[400]} 1px`,
              display: "flex",
              borderRadius: 1,
            }}
          >
            <LoadingButton
              component="label"
              variant="text"
              size="small"
              sx={buttonStyle}
              onClick={loadDicom}
            >
              Выгрузить
            </LoadingButton>
            <Stack flexDirection="column">
              <TextField
                InputProps={{
                  style: {
                    color: grey[400],
                  },
                }}
                hiddenLabel
                id="dicomNumber"
                onChange={handleChangeInput}
                variant="filled"
                size="small"
              />
            </Stack>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
