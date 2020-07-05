// Це псевдо JSON для пояснення структури коду і даних проєкту TREEMAP

Im : {           // структура атрибутів окремого панорамного зображення

  properties: {  // блок, взятий з Mapillary API
    ca: Deg_Number,
    captured_at: Date_Str,
    key: Im_Hashtag,
    pano: true,
    sequence_key: Seq_Hashtag,
    user_key: User_Hashtag
  },
  geometry: {    // блок, взятий з Mapillary API
    coordinates: [
      Lat, Long
    ]
  },
  elevation, // висота камери над рівнем поверхні зйомки
  Tr: [ // масив дерев, помічених і прив'язаних до цього зображення Im
    {
      az,         // азимут спостереження центра дерева (по нижній частині)
      pitch,      // верт кут спостереження нижньої дерева
      Im_Tr_Key,  // індекс дерева у цьому зображенні
      is_Plane_Horiz: true, // чи поверхня землі горизонтальна
      coord_1: [  // координати, розраховані з 1 зображення, if is_Plane_Horiz == true [Однокадрове визначення координат](https://bit.ly/38cvfk1)
        Lat, Long
      ]
    },
    {
      ...
    }
  ]
}

Im_Pair: {
  Im0_Key, Im1_Key, // keys of two Images
  Tr_Pair [       // array of tree pairs from two images
    {
      Im0_Tr_Key, // tree key from Im0, can be used 1 time in Tr_Pair
      Im1_Tr_Key, // tree key from Im1, can be used 1 time in Tr_Pair
      Tr_Key,     // tree key unbound from Images
      coord_2     // calculated from two images (treemap_calculator)
    },
    { Im0_Tr_Key, Im1_Tr_Key, Tr_Key, coord_2 },
    { ... }
  ]
}

Tr_Unbound: {  // tree unbound from Images
  Tr_Key,      // tree key from Im_Pair
  Coord_Arr: [ // array of coordinates calculated from several pairs of images (treemap_calculator)
    { Im0_Tr_Key, Im1_Tr_Key, coord_2 },
    { Im0_Tr_Key, Im1_Tr_Key, coord_2 },
    ...
  ],
  Rt: {   // rectangles for measurement of 
    Rt0: [x0, y0, x1, y1],   // lower rectangle for trunk width
    Rt1: [x0, y0, x1, y1],   // upper rectangle for tree crown
    Im_Tr_Key: Im_Tr_Hashtag // tree key at this Im after it is marked
  },
  Tr_W,
  Tr_H,
  Tr_Cr,
  Tr_Coord_2: [ Lat, Long ],
  Tr_Coord_2_Err,
  Tr_Coord_1: [ Lat, Long ],
  Tr_Coord_1_Err
}
