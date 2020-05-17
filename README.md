# Це демо версія додатку, щоб запустити використайте команду:
```
yarn start
```
або

```
npm run start
```

*Важливо: у вас повиний бути встановлений node.js та пакетний менеджер npm або yarn*

# Інвентаризація зелених насаджень міста

Проєктна ідея полягає у автоматизації процесу збирання інформації про наявні у місті зелені насадження, як-то: координати, розміри, порода, стан дерева, а також зручному пошуку і перегляді дерев на карті за різними критеріями, обліку і плануванні заходів по конкретних деревах. Запропоновані технології будуть корисні і затребувані як працівниками комунальних підприємств, що опікуються зеленими насадженнями, а також мешканцями. 

# Концепт ідеї проєкту

Принцип, покладений в основу, полягає у обробці послідовних панорамних знімків отриманих вздовж маршруту просування облікового обладнання. Для отримання панорамного знімку може бути використана зйомка об'єктивом типу "риб'яче око". Отриманий знімок може охоплювати напівсферу, або навіть дещо більше, і цього типу об'єктиви мають доволі доступну ціну. Об'єктив має бути зорієнтований по вертикалі, апарата має бути точно зорієнтований за азимутом і мати точно визначені координати. Тобто зйомка проводиться в точно відомих 6D координатах. 

Схематично переведення панорамного зображення у площину прямокутної матриці світлочутливих елементів (пікселів) виглядає таким чином:
![Рисунок 1. Схема панорамної зйомки апаратом у точно відомих 6D координатах.](https://protw.github.io/treemap/images/img%252F01-fisheye.png)

За отриманим панорамним знімком оператор може визначити для конкретного об'єкта (дерева) його азимут, вертикальні кути підніжжя і верхівки, а також кутову ширину стовбура.

По двох послідовних знімках оператор отримує значення азимуту в кожній з двох точок з відомими координатами. Таким чином, рішенням задачі триангуляції для двох точок з відомими координатами і значеннями азимуту спостереження об'єкта є координати спостережуваного об'єкта.

# Докладніше пояснення

Для докладнішого пояснення розберемо проведення двох послідовних панорамних знімків на місцевості. Перший знімок проводиться у точці 1 (червона). В ній фіксуються географічні координати апарату і азимутальний кут його орієнтування. фокусна площина об'єктиву завжди підтримується у горизонтальному положенні з допомогою карданного підвісу (гімбал). У цій точці два об'єкта (дерева 1 і 2) спостерігаються під певними азимутальними кутами, що позначені червоними стрілками. Власне кути вимірюватимуться пізніше, вже після проведення зйомки.

Аналогічні дії проводяться в точці 2 (блакитна точка і стрілки).

![Рисунок 2. Схема отримання двох послідовних панорамних знімків об'єктів на місцевості.](https://protw.github.io/treemap/images/img%252F02-scheme-3D.svg)

Результати процедури на місцевості для чіткішого уявлення представлені на 2D плані цієї місцевини:
![Рисунок 3. Схема отримання двох послідовних панорамних знімків об'єктів на плані місцевості.](https://protw.github.io/treemap/images/img%252F03-scheme-2D.svg)

Після проведення зйомок відбувається аналіз (вимірювання відстаней і розмірів) об'єктів в камеральних умовах. Для цього одночасно оператор розглядає по парі послідовних знімків. Для кожного знімку проводиться перетворення кутового зображення у прямокутні декартові координати, де азимут кожного піксела - це абсциса, а вертикальний кут піксела - це ордината.

Схематично панорамні зображення, зроблені в точках 1 і 2, представлені нижче.
![Рисунок 4. Кутове зображення, отримане в точці 1, розгорнуте в прямокутні декартові координати (азимут - абсциса, вертикальний кут - ордината).](https://protw.github.io/treemap/images/img%252F04-screenshot-1.svg)
![Рисунок 5. Кутове зображення, отримане в точці 2, розгорнуте в прямокутні декартові координати (азимут - абсциса, вертикальний кут - ордината).](https://protw.github.io/treemap/images/img%252F05-screenshot-2.svg)

Вимірювання розташування кожного дерева відбувається шляхом зведення променів (насправді меридіанних площин) на одному і тому ж дереві на двох різних кадрах. На кожному представленому кадрі (рисунки 4 і 5) меридіанні площини виглядають як вертикальні лінії.

# Укрупнений план робіт за проєктом

- Визначення необхідних характеристик і вибір конкретних моделей обладнання: диференціальний GPS, компас, карданний підвіс (гімбал), фотообладнання для панорамної зйомки. 
- Прорахувати, що економічно вигідніше - закупівля або оренда обладнання.
- Програмно-апаратне забезпечення синхронізації моментів фотознімку і вимірювання координат та орієнтування апаратури з подальшою інтеграцією отриманих даних.
- Розробка програмного забезпечення вимірювання параметрів дерева (координати, висота, діаметр стовбура, розміри крони) за двома і більше суміжними панорамними фотознімками. Введення додаткової інформації: порода дерева, примітки тощо.
- Розробка програмного забезпечення для відображення дерев на карті міста, зручного пошуку і перегляді дерев на карті за різними критеріями, обліку і планування заходів по конкретних деревах, організації звернення мешканців по конкретному дереву і контроль виконання кожного звернення.
- Визначення обсягу робіт в місті з проведення інвентаризації зелених насаджень і виконання цих робіт.
- Звіт. Висновки, включно зі шляхами розвитку запропонованої технології.

