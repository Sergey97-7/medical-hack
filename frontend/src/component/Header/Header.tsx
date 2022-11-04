import {
  AppBar,
  Toolbar,
  ButtonGroup,
  Button,
  Typography,
  Slider,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import styles from "./Header.module.scss";

const drawerWidth = 240;
const buttonStyle = { color: grey[400], borderColor: grey[400] };

interface HeaderProps {
  addRect: () => void;
  addCircle: () => void;
  addLine: () => void;
  loadImage: () => void;
  getObjects: () => void;
  getInterceptions: () => void;
  clearImgFilters: () => void;
  handleRange: (name: string) => () => void;
  contrastValue: number;
  brightnessValue: number;
}

export function Header({
  addRect,
  addCircle,
  addLine,
  loadImage,
  getObjects,
  getInterceptions,
  clearImgFilters,
  handleRange,
  contrastValue,
  brightnessValue,
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
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <Button sx={buttonStyle} onClick={addRect}>
            квадрат
          </Button>
          <Button sx={buttonStyle} onClick={addCircle}>
            круг
          </Button>
          <Button sx={buttonStyle} onClick={addLine}>
            линейка
          </Button>
          <Button sx={buttonStyle} onClick={loadImage}>
            Выгрузить снимок
          </Button>
        </ButtonGroup>
        {/* <Button sx={buttonStyle} onClick={getObjects}>Все объекты</Button>
          <Button sx={buttonStyle} onClick={getInterceptions}>
            Получить разметку
          </Button>  */}
        <Button onClick={clearImgFilters}>Сбросить фильтры</Button>
        <div className={styles.sliderContainer}>
          <Typography
            sx={{ ...buttonStyle, marginRight: 2 }}
            variant="subtitle2"
          >
            КОНТРАСТ:
          </Typography>
          <Slider
            onChange={handleRange("contrast")}
            value={contrastValue}
            min={-0.9}
            max={0.9}
            step={0.05}
            aria-label="Slider"
            valueLabelDisplay="off"
          />
          <Typography
            sx={{ ...buttonStyle, marginRight: 2 }}
            variant="subtitle2"
          >
            ЯРКОСТЬ:
          </Typography>
          <Slider
            value={brightnessValue}
            onChange={handleRange('brightness')}
            min={-0.9}
            max={0.9}
            step={0.05}
            aria-label="Slider"
            valueLabelDisplay="off"
          />
        </div>
      </Toolbar>
    </AppBar>
  );
}
