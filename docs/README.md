# Документация проекта

# Адрес сервера

`http://45.135.165.211:8181`

## API

### Загрузка DICOM файла

*Метод*: `POST`

*Путь*: `/dicom`

| Parameter | Description |
| :----------- | :--------------- |
| file | DICOM файл в формате Multipart файл |

Ответ:


```json
{
    "dicomId": "Integer"
}
```

### Данные DICOM

Запрос возвращает поля из DICOM файла с указанным идентификатором. Медиа не возвращается. Вместо медиа возвращаются идентификаторы, используя которые можно получить данные отдельными запросами.

*Метод*: `GET`

*Путь*: `/dicom/{dicomId}/fields`

Параметры:

| Parameter | Description |
| :----------- | :--------------- |
| dicomId | Идентификатор файла|

Ответ:

```json
{
    "dicomId": "Integer",
    "imagesNumber": "Integer",
    "modality": "String"
}
```

### Изображение

Запрос возвращает из DICOM файла с идентификатором {dicomId} изображение с идентификатором {imageId}

*Метод*: `GET`

*Путь*: `/dicom/{dicomId}/image/{imageId}`

| Parameter | Description |
| :----------- | :--------------- |
| dicomId | Идентификатор файла |
| imageId | Идентификатор изображения |

Ответ: изображение

### Получение разметки для изображения

Запрос возвращает набор примитивов разметки для изображения {imageId} DICOM файла {dicomId}

*Метод*: `GET`

*Путь*:  `/dicom/{dicomId}/image/{imageId}/markup`

| Parameter | Description |
| :----------- | :--------------- |
| dicomId | инедтификатор файла |
| imageId | Идентификатор изображения |

Ответ:

```json
{
  "dicomId": "Integer",
  "imageId": "Integer",
  "tags": ["String"],
  "markup": [
    {
      "type": "String",
      "geometry": [
        {
          "x": "Float",
          "y": "Float"
        }
      ]
    }
  ]
}
```

### Сохранение разметки для изображения

Запрос сохранения разметки для изображения из DICOM файла 

*Метод*: `POST`

*Путь*:  `/dicom/{dicomId}/image/{imageId}/markup`

| Parameter | Description |
| :----------- | :--------------- |
| dicomId | инедтификатор файла |
| imageId | Идентификатор изображения |
| tags | Список тегов |
| type | Тип примитива |
| geometry | Список точек примитива |

Тело запроса:

```json
{
  "tags": ["String"],
  "markup": [
    {
      "type": "String",
      "geometry": [
        {
          "x": "Float",
          "y": "Float"
        }
      ]
    }
  ]
}
```

Ответ:

```json
{
  "dicomId": "Integer",
  "imageId": "Integer",
  "tags": ["String"],
  "markup": [
    {
      "type": "String",
      "geometry": [
        {
          "x": "Float",
          "y": "Float"
        }
      ]
    }
  ]
}
```
