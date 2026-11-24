const BELLS = {
  monday: [
    { num: 0, name: "Классный час", start: "08:30", end: "09:15" },
    { num: 1, name: "1 пара", start: "09:30", end: "10:40" },
    { num: 2, name: "2 пара", start: "10:55", end: "12:05" },
    { num: 3, name: "3 пара", start: "12:45", end: "13:55" },
    { num: 4, name: "4 пара", start: "14:10", end: "15:20" },
    { num: 5, name: "5 пара", start: "15:30", end: "16:20" }
  ],
  regular: [
    { num: 1, name: "1 пара", start: "08:30", end: "10:05" },
    { num: 2, name: "2 пара", start: "10:20", end: "11:55" },
    { num: 3, name: "3 пара", start: "12:35", end: "14:10" },
    { num: 4, name: "4 пара", start: "14:20", end: "15:55" },
    { num: 5, name: "5 пара", start: "16:05", end: "17:15" }
  ]
};

const DEFAULT_SCHEDULE = {
  // --- 1 КУРС ---
  "ЭРО-26": { 1: [[0,"Классный час","",""],[1,"Обществознание","Пятанина Л.А.","63"],[2,"Информатика","Доланчи / Донская","21/22"],[3,"Физ. культ.","Сидоров Г.Н.","с/з 6к"]], 2: [[1,"Осн. черчения","Блохина / Журавлева","53/59"],[2,"Литература","Пантелеева Н.В.","65"],[3,"ОБЗР","Гребницкий В.А.","62"]], 3: [[1,"Рус. язык","Пантелеева Н.В.","65"],[2,"Информатика","Доланчи / Донская","21/22"],[3,"История","Пятанина Л.А.","63"],[4,"География","Власова О.Б.","14"]], 4: [[1,"Литература","Пантелеева Н.В.","65"],[2,"Математика","Потапова А.А.","67"],[3,"Англ. язык","Утробина / Соколова","64 / 61"]], 5: [[1,"Математика","Потапова А.А.","67"],[2,"Биология","Рахматуллина О.А.","69"],[3,"Физика","Шелухина Г.К.","74"],[4,"Физика","Шелухина Г.К.","74"]], 6: [[1,"Информатика","Доланчи / Донская","дист."],[2,"Математика","Потапова А.А.","дист."]] },
  "СЭЗ-26": { 1: [[0,"Классный час","",""],[1,"Рус. язык","Пантелеева Н.В.","65"],[2,"Обществознание","Пятанина Л.А.","63"],[3,"Информатика","Доланчи / Донская","21/22"],[4,"Физика","Рахматуллина О.А.","69"]], 2: [[1,"Литература","Пантелеева Н.В.","65"],[2,"Информатика","Доланчи / Донская","21/22"],[3,"История","Пятанина Л.А.","63"],[4,"ОБЗР","Гребницкий В.А.","62"]], 3: [[1,"География","Власова О.Б.","14"],[2,"Физика","Рахматуллина О.А.","69"],[3,"Математика","Потапова А.А.","67"]], 4: [[1,"Осн. черчения","Блохина / Журавлева","53/59"],[2,"Англ. язык","Утробина / Соколова","64 / 61"],[3,"Физ. культ.","Сидоров Г.Н.","с/з 6к"]], 5: [[1,"Литература","Пантелеева / Пятанина","65 / 63"],[2,"Математика","Потапова А.А.","67"],[3,"Биология","Рахматуллина О.А.","69"]], 6: [[1,"Тех. механика","Суюшкина Е.В.","дист."],[2,"Информатика","Доланчи / Донская","дист."],[3,"МДК 01.01.","Милькевич Н.Ю.","дист."]] },
  "КСК-26": { 1: [[0,"Классный час","",""],[1,"Физика","Рахматуллина О.А.","69"],[2,"Рус. язык","Пантелеева Н.В.","65"],[3,"Математика","Потапова А.А.","67"],[4,"ОБЗР","Гребницкий В.А.","62"]], 2: [[1,"Биология","Рахматуллина О.А.","69"],[2,"Осн. черчения","Блохина / Журавлева","53/59"],[3,"Информатика","Доланчи / Донская","21/22"],[4,"География","Власова О.Б.","14"]], 3: [[1,"Физ. культ.","Сидоров Г.Н.","с/з 6к"],[2,"Физика","Рахматуллина О.А.","69"],[3,"Рус. язык","Пантелеева Н.В.","65"],[4,"История","Пятанина Л.А.","63"]], 4: [[1,"Математика","Потапова А.А.","67"],[2,"Информатика","Доланчи / Донская","21/22"],[3,"Литература","Пантелеева Н.В.","65"]], 5: [[1,"Англ. язык","Утробина / Соколова","64 / 61"],[2,"Литература","Пантелеева / Пятанина","65 / 63"],[3,"Обществознание","Пятанина Л.А.","63"]], 6: [[1,"Информатика","Доланчи / Донская","дист."],[2,"Математика","Потапова А.А.","дист."],[3,"Физика","Рахматуллина О.А.","дист."]] },
  "ТОА-26": { 1: [[0,"Классный час","",""],[1,"Физ. культ.","Сидоров Г.Н.","с/з 6к"],[2,"Физика","Рахматуллина О.А.","69"],[3,"Обществознание","Пятанина Л.А.","63"]], 2: [[1,"Мед.группа","Корольченко П.В.","с/з"],[2,"Биология","Рахматуллина О.А.","69"],[3,"Литература","Пантелеева Н.В.","65"],[4,"Информатика","Донская / Петраш","22 / 24"]], 3: [[1,"Физика","Рахматуллина О.А.","69"],[2,"Математика","Потапова А.А.","67"],[3,"Рус. язык","Пантелеева Н.В.","65"]], 4: [[1,"История","Пятанина Л.А.","63"],[2,"Осн. черчения","Блохина / Журавлева","53/59"],[3,"Информатика","Донская / Петраш","22 / 24"],[4,"География","Власова О.Б.","14"]], 5: [[1,"ОБЗР","Гребницкий В.А.","62"],[2,"Англ. язык","Утробина / Соколова","64 / 61"],[3,"Математика","Потапова А.А.","67"],[4,"История","Пятанина Л.А.","63"]], 6: [[1,"Математика","Потапова А.А.","дист."],[2,"Информатика","Донская / Петраш","дист."]] },
  "ОДЛ-26": { 1: [[0,"Классный час","",""],[1,"География","Власова О.Б.","14"],[2,"Физ. культ.","Сидоров Г.Н.","с/з 6к"],[3,"Физика","Рахматуллина О.А.","69"],[4,"Обществознание","Пятанина Л.А.","63"]], 2: [[1,"ОБЗР","Гребницкий В.А.","62"],[2,"КСПД","Донская / Лесина","24 / 25"],[3,"Биология","Рахматуллина О.А.","69"],[4,"История","Пятанина Л.А.","63"]], 3: [[1,"Математика","Потапова А.А.","67"],[2,"Рус. язык","Пантелеева Н.В.","65"],[3,"Информатика","Доланчи / Донская","21/22"]], 4: [[1,"Литература","Пантелеева Н.В.","65"],[2,"Математика","Потапова А.А.","67"],[3,"Информатика","Доланчи / Донская","21/22"]], 5: [[1,"Физика","Рахматуллина О.А.","69"],[2,"История","Пятанина Л.А.","63"],[3,"Англ. язык","Утробина / Соколова","64 / 61"]], 6: [[1,"Математика","Потапова А.А.","дист."],[2,"Информатика","Доланчи / Донская","дист."]] },
  
  // --- 2 КУРС ---
  "ЭРО-25": { 1: [[0,"Классный час","",""],[1,"Англ. язык","Соколова Е.Ю.","61"],[2,"Прикл. математ.","Потапова А.А.","67"],[3,"Инж. графика","Блохина / Журавлева","53/59"]], 2: [[1,"Мед.группа","Корольченко П.В.","с/з"],[2,"Материаловед.","Киви Т.И.","32"],[3,"Техн. механика","Суюшкина Е.В.","56"],[4,"МДК 03.01.","Саитгалеев А.Р.","30"]], 3: [[1,"Физ. культ.","Сидоров Г.Н.","с/з 6к"],[2,"История России","Пятанина Л.А.","63"],[3,"Электротехника","Чумаченко С.И.","36"],[4,"Инфор. технологии","Доланчи / Донская","21/22"]], 4: [[1,"Делопроизвод.","Айкашева Н.С.","14"],[2,"Электротехника","Чумаченко С.И.","36"],[3,"КСПД «Компас»","Блохина / Журавлева","23/25"],[4,"Электробезоп.","Саитгалеев А.Р.","30"]], 5: [[1,"МДК 01.01","вакансия","18"],[2,"Инж. графика","Блохина / Журавлева","53,59"],[3,"Эколог.осн.прир.","Киви Т.И.","32"],[4,"МДК 03.01.","Саитгалеев А.Р.","30"]], 6: [[1,"История Р.","Пятанина / Киви","дист."],[2,"Материаловед.","Киви Т.И.","дист."]] },
  "СЭЗ-25": { 1: [[0,"Классный час","",""],[1,"Осн. геодезии","Суюшкина Е.В.","56"],[2,"Инж. графика","Блохина / Журавлева","53/59"],[3,"Осн. электротех.","Чумаченко С.И.","36"],[4,"Инфор. технологии","Доланчи / Донская","21/22"]], 2: [[1,"История России","Пятанина Л.А.","63"],[2,"Матем. метод.","Милькевич Н.Ю.","55"],[3,"КСПД «Компас»","Блохина / Журавлева","23/25"],[4,"МДК 01.01.","Киви Т.И.","32"]], 3: [[1,"Инфор. технологии","Доланчи / Донская","21/22"],[2,"Англ. язык","Соколова Е.Ю.","61"],[3,"Физ. культ.","Сидоров Г.Н.","с/з 6к"]], 4: [[1,"Техн. механика","Суюшкина Е.В.","56"],[2,"Матем. метод.","Милькевич Н.Ю.","55"],[3,"Делопроизвод.","Айкашева Н.С.","14"],[4,"Осн. геодезии","Суюшкина Е.В.","56"]], 5: [[1,"МДК 01.01.","Милькевич Н.Ю.","55"],[2,"Осн. электротех.","Чумаченко","36"],[3,"МДК 01.01.","Милькевич Н.Ю.","55"]], 6: [[1,"Тех. механика","Суюшкина Е.В.","дист."],[2,"Инфор. технологии","Доланчи / Донская","дист."],[3,"МДК 01.01.","Милькевич Н.Ю.","дист."]] },
  "КСК-25": { 1: [[0,"Классный час","",""],[1,"Инф. технологии","Донская / Потапова","22/23"],[2,"Англ. язык","Соколова Е.Ю.","61"],[3,"МДК 01.02.","Степанова Ю.В.","26"],[4,"Эл.высш.матем.","Потапова А.А.","67"]], 2: [[1,"Инж. графика","Рогальская Т.И.","25"],[2,"Операц. сист. и ср.","Степанова Ю.В.","26"],[3,"Осн. электротех.","Чумаченко","36"],[4,"Физ. культ.","Корольченко П.В.","с/з гл"]], 3: [[1,"Web-дизайн","Петраш Е.В.","24"],[2,"Осн. электротех.","Чумаченко","36"],[3,"Операц. сист. и ср.","Степанова Ю.В.","26"],[4,"Web-дизайн","Петраш Е.В.","24"]], 4: [[1,"Инж. графика","Рогальская Т.И.","25"],[2,"Делопроизвод.","Айкашева Н.С.","14"],[3,"История России","Пятанина Л.А.","63"],[4,"МДК 01.01.","Степанова Ю.В.","26"]], 5: [[1,"МДК 04.01.","Доланчи / Петраш","21/24"],[2,"МДК 04.01.","Доланчи / Петраш","21/24"],[3,"МДК 01.01.","Степанова Ю.В.","26"],[4,"Эл.высш.мат.","Потапова","67"]], 6: [[1,"МДК 01.02","Степанова / Пятанина","дист."],[2,"МДК 01.02","Степанова / Пятанина","дист."],[3,"Операц. сист. и ср.","Степанова Ю.В.","дист."],[4,"МДК 04.01","Доланчи / Петраш","дист."]] },
  "ТОА-25": { 1: [[0,"Классный час","",""],[1,"Инж. графика","Блохина / Журавлева","53/59"],[2,"Техн. механика","Суюшкина Е.В.","56"],[3,"МДК 01.01.","Камкова Н.И.","13"],[4,"Электротехника","Чумаченко С.И.","36"]], 2: [[1,"Мед.группа","Корольченко П.В.","с/з"],[2,"Делопроизвод.","Айкашева Н.С.","14"],[3,"Материаловед.","Красиков А.Н.","13"],[4,"КСПД «Компас»","Блохина / Журавлева","23/25"]], 3: [[1,"История России","Пятанина Л.А.","63"],[2,"Техн. механика","Суюшкина Е.В.","56"],[3,"Материаловед.","Красиков А.Н.","рес.ц"]], 4: [[1,"Англ. язык","Соколова Е.Ю.","61"],[2,"История России","Пятанина Л.А.","63"],[3,"МДК 01.01.","Камкова Н.И.","13"]], 5: [[1,"Инж. графика","Блохина / Журавлева","53/59"],[2,"Техн. механика","Суюшкина Е.В.","56"],[3,"Электротехника","Чумаченко С.И.","36"],[4,"Физ. культ.","Корольченко П.В.","с/з гл"]], 6: [[1,"Материаловед.","Красиков А.Н.","дист."],[2,"Техн. механика","Суюшкина Е.В.","дист."],[3,"МДК 01.01.","Камкова Н.И.","дист."]] },
  "ОДЛ-25": { 1: [[0,"Классный час","",""],[1,"МДК 05.01.","Фомичева Н.С.","57"],[2,"МДК 05.01.","Фомичева Н.С.","57"],[3,"МДК 01.01.","Гневашева Т.В.","50"]], 2: [[1,"Англ. язык","Соколова Е.Ю.","61"],[2,"История России","Пятанина Л.А.","63"],[3,"МДК 01.01.","Гневашева Т.В.","50"],[4,"МДК 01.02.","Гневашева Т.В.","50"]], 3: [[1,"МДК 01.02.","Гневашева Т.В.","50"],[2,"МДК 01.02.","Гневашева Т.В.","50"],[3,"БЖ","Гребиницкий В.А.","62"],[4,"Статистика","Фомичева Н.С.","57"]], 4: [[1,"МДК 02.01.","Гневашева Т.В.","50"],[2,"ДОУ","Фомичева Н.С.","57"],[3,"Статистика","Фомичева Н.С.","57"]], 5: [[1,"КСПД «Office»","Донская / Фомичева","22/26"],[2,"Физ. культ.","Корольченко П.В.","с/з гл"],[3,"Экономика орг.","Фомичева Н.С.","57"],[4,"Осн.логис.деят.","Гневашева Т.В.","50"]], 6: [[1,"МДК 01.02","Гневашева / Пятанина","дист."],[2,"Осн.лог.д.","Гневашева / Фомичева","дист."]] },

  // --- 3 КУРС ---
  "ЭРО-24": { 1: [[0,"Классный час","",""],[1,"Оформ.докум.ГОСТ","Рогальская / Киви","25/26"],[2,"МДК 01.03","Киви Т.И.","32"],[3,"МДК 01.02","Саитгалеев А.Р.","30"]], 2: [[1,"Физ.культ.","Корольченко П.В.","с/з"],[2,"Охр.труда","Саитгалеев А.Р.","30"],[3,"Электромаш.","Киви Т.И.","32"],[4,"Осн.береж.пр.","Чумаченко С.И.","36"]], 3: [[1,"Электробезоп.","Саитгалеев А.Р.","30"],[2,"БЖ","Гребницкий В.А.","62"],[3,"Электронасб.","вакансия","18"],[4,"Электронасб.","вакансия","18"]], 4: [[1,"МДК 05.01","Саитгалеев А.Р.","30"],[2,"МДК 05.01","Саитгалеев А.Р.","30"],[3,"МДК 05.01","Саитгалеев А.Р.","30"]], 5: [[1,"МДК 01.02","Саитгалеев А.Р.","30"],[2,"Горн.дело и БВР","Киви Т.И.","32"],[3,"Осн.пред.ТВ","Шелухина Г.К.","74"],[4,"Электромаш.","Киви Т.И.","32"]], 6: [[1,"МДК 01.03","Саитгалеев","дист."],[2,"Электромаш.","Киви","дист."],[3,"Охр.тр.","Саитгалеев","дист."]] },
  "СЭЗ-24": { 1: [[0,"Классный час","",""],[1,"МДК 01.01.Арх","Милькевич Н.Ю.","55"],[2,"Инж. сети","Суюшкина Е.В.","56"],[3,"МДК 01.01.Арх","Милькевич Н.Ю.","55"]], 2: [[1,"Инфор.технологии","Доланчи / Донская","21/22"],[2,"Англ. язык","Соколова Е.Ю.","61"],[3,"МДК 01.01.Арх","Милькевич Н.Ю.","55"],[4,"МДК 01.01.Констр","Басмаулина О.И.","14"]], 3: [[1,"БЖ","Гребницкий В.А.","62"],[2,"Ниж.сети Строит","Суюшкина / Рогальская","56/25"]], 4: [[1,"Web-дизайн 1взр","Петраш Е.В.","24"],[2,"МДК 01.02","Степанова Ю.В.","26"],[3,"Осн.береж.пр.","Чумаченко С.И.","36"],[4,"Оформ.докум.ГОСТ","Журавлева / Милькевич","23/55"]], 5: [[1,"Метрология","Киви Т.И.","32"],[2,"МДК 01.02","Степанова Ю.В.","26"],[3,"Физ.культ.","Корольченко П.В.","с/з"],[4,"Ниж.сети","Суюшкина Е.В.","56"]], 6: [[1,"МДК 02.01","Лыжина Н.О.","дист."],[2,"МДК 02.01","Лыжина Н.О.","дист."],[3,"МДК 01.01.грматер","Милькевич","дист."]] },
  "КСК-24": { 1: [[0,"Классный час","",""],[1,"Осн.алгоритмиз.","Доланчи / Петраш","21/24"]], 2: [[1,"Метрология","Красиков А.Н.","13"],[2,"МДК 04.01","Мокляк С.В.","рес.ц"],[3,"МДК 01.02","Степанова Ю.В.","26"],[4,"Англ. язык","Соколова Е.Ю.","61"]], 3: [[1,"МДК 01.03","Камкова Н.И.","13"],[2,"Метрология","Красиков А.Н.","рес.ц"],[3,"Осн.философии","Фомичева Н.С.","57"],[4,"МДК 01.01","Камкова Н.И.","13"]], 4: [[1,"Инфор.технологии","Доланчи / Донская","21/22"],[2,"Физ.культ.","Сидоров Г.Н.","с/з 6к"],[3,"МДК 03.02","Красиков А.Н.","рес.ц"],[4,"МДК 03.02","Красиков А.Н.","рес.ц"]], 5: [[1,"Метрология","Киви Т.И.","32"],[2,"МДК 01.02","Степанова Ю.В.","26"],[3,"Осн.алгоритмиз.","Доланчи / Петраш","21/24"]], 6: [[1,"МДК 02.01","Петраш","дист."],[2,"МДК 02.01","Петраш","дист."],[3,"МДК 01.02","Степанова","дист."],[4,"Осн.береж.пр.","Гребницкий","дист."]] },
  "ТОП-24": { 1: [[0,"Классный час","",""],[1,"МДК 01.01","Камкова Н.И.","13"],[2,"БЖ","Гребницкий В.А.","62"],[3,"Осн.философии","Фомичева Н.С.","57"]], 2: [[1,"Метрология","Красиков А.Н.","13"],[2,"МДК 04.01","Мокляк С.В.","рес.ц"],[3,"МДК 01.02","Степанова Ю.В.","26"],[4,"Англ. язык","Соколова Е.Ю.","61"]], 3: [[1,"МДК 01.03","Камкова Н.И.","13"],[2,"Метрология","Красиков А.Н.","рес.ц"],[3,"Осн.философии","Фомичева Н.С.","57"],[4,"МДК 01.01","Камкова Н.И.","13"]], 4: [[1,"Инфор.технологии","Доланчи / Донская","21/22"],[2,"Физ.культ.","Сидоров Г.Н.","с/з 6к"],[3,"МДК 03.02","Красиков А.Н.","рес.ц"],[4,"МДК 03.02","Красиков А.Н.","рес.ц"]], 5: [[1,"Метрология","Киви Т.И.","32"],[2,"МДК 01.02","Степанова Ю.В.","26"],[3,"Осн.алгоритмиз.","Доланчи / Петраш","21/24"]], 6: [[1,"Инфор.технологии","Доланчи / Донская","дист."],[2,"МДК 01.03","Камкова","дист."],[3,"Метрология","Красиков","дист."]] },
  
  // ИСПРАВЛЕНО: Строго 1ОДЛ-24 и 2ОДЛ-24 (без ЮДЛ и 20ДЛ)
  "1ОДЛ-24": { 1: [[0,"Классный час","",""],[1,"МДК 03.01","Панина Ю.А.","66"],[2,"Менеджмент","Гневашева Т.В.","50"],[3,"Экономика орг.","Фомичева Н.С.","57"]], 2: [[1,"Налоги","Финансы Фомичева","57"],[2,"МДК 03.01","Панина Ю.А.","66"],[3,"МДК 03.02","Панина Ю.А.","66"],[4,"Бух. учет","Панина Ю.А.","66"]], 3: [[1,"Финансы","Фомичева Н.С.","57"],[2,"МДК 03.02","Панина Ю.А.","66"],[3,"Англ. язык","Соколова Е.Ю.","61"],[4,"Бух. учет","Панина Ю.А.","66"]], 4: [[1,"МДК 04.01","Панина Ю.А.","66"],[2,"Налоги","Фомичева Н.С.","57"],[3,"Физ.культ.","Корольченко П.В.","с/з"],[4,"Бух. учет","Панина Ю.А.","66"]], 5: [[1,"КСПД «1С» 1взр","Бартюк Н.И.","25"],[2,"КСПД «1С» 1взр","Бартюк Н.И.","25"],[3,"МДК 04.02","Панина Ю.А.","66"],[4,"КСПД «1С» 2взр","Бартюк Н.И.","25"]], 6: [[1,"МДК 03.01","Панина","дист."],[2,"Экономика","Фомичева","дист."],[3,"Менеджмент","Гневашева","дист."],[4,"МДК 04.01","Панина","дист."]] },
  "2ОДЛ-24": { 1: [[0,"Классный час","",""],[1,"Менеджмент","Гневашева Т.В.","50"],[2,"МДК 03.01","Панина Ю.А.","66"],[3,"МДК 04.02","Панина Ю.А.","66"]], 2: [[1,"Физ.культ.","Корольченко П.В.","с/з"],[2,"Налоги","Фомичева Н.С.","57"],[3,"Экономика орг.","Фомичева Н.С.","57"],[4,"Бух. учет","Панина Ю.А.","66"]], 3: [[1,"МДК 03.02","Панина Ю.А.","66"],[2,"Финансы","Фомичева Н.С.","57"],[3,"Бух. учет","Панина Ю.А.","66"],[4,"Англ. язык","Соколова Е.Ю.","61"]], 4: [[1,"Налоги","Фомичева Н.С.","57"],[2,"МДК 04.01","Панина Ю.А.","66"],[3,"Бух. учет","Панина Ю.А.","66"]], 5: [[1,"КСПД «1С» 2взр","Бартюк Н.И.","25"],[2,"МДК 03.02","Панина Ю.А.","66"],[3,"КСПД «1С» 2взр","Бартюк Н.И.","25"]], 6: [[1,"Экономика","Фомичева","дист."],[2,"Менеджмент","Гневашева","дист."],[3,"МДК 03.01","Панина","дист."],[4,"МДК 04.01","Панина","дист."]] },

  // --- 4 КУРС ---
  "ТЭРО-23": { 1: [[0,"Классный час","",""]], 2: [[3,"МДК 05.01","Шипков А.Е.","дист."],[4,"МДК 05.01","Шипков А.Е.","32"]], 3: [[3,"МДК 05.01","Шипков А.Е.","дист."],[4,"МДК 05.01","Шипков А.Е.","32"]], 4: [[3,"МДК 05.01","Шипков А.Е.","дист."],[4,"МДК 05.01","Шипков А.Е.","32"]], 5: [[4,"МДК 05.01","Шипков А.Е.","дист."],[5,"МДК 05.01","Шипков А.Е.","32"]], 6: [[2,"МДК 05.01","Шипков А.Е.","дист."],[3,"МДК 05.01","Шипков А.Е.","дист."],[4,"МДК 05.01","Шипков А.Е.","дист."]] },
  "СЭЗ-23": { 1: [[0,"Классный час","",""],[3,"МДК 04.01","Милькевич Н.Ю.","55"],[4,"Оформ.докум.ГОСТ","Журавлева Е.А.","26"]], 2: [[3,"МДК 04.01","Милькевич Н.Ю.","55"],[4,"МДК 02.01","Суюшкина Е.В.","56"]], 3: [[3,"Осн.финан.грам.","Лесина Т.Р.","31"],[4,"МДК 02.01","Суюшкина Е.В.","56"]], 4: [[3,"МДК 03.01","Суюшкина Е.В.","56"],[4,"Англ. язык","Соколова Е.Ю.","61"]], 5: [[1,"Физ.культ.","Сидоров Г.Н.","с/з 6к"],[2,"МДК 04.01","Милькевич Н.Ю.","55"],[3,"КСПД «4 разряд»","Суюшкина Е.В.","22/23"]], 6: [[2,"МДК 02.01","Суюшкина","дист."],[3,"МДК 03.01","Суюшкина","дист."],[4,"МДК 02.02","Басмаулина","дист."]] },
  "КСК-23": { 1: [[0,"Классный час","",""],[1,"МДК 03.02","Степанова Ю.В.","35"],[2,"Оформ.докум.ГОСТ","Рогальская / Петраш","25/24"],[3,"Прав.обесп.проф.","Квитко Е.А.","14"]], 2: [[1,"МДК 02.02","Петраш Е.В.","24"],[2,"Англ. язык","Соколова Е.Ю.","61"],[3,"МДК 03.01","Степанова Ю.В.","26"]], 3: [[1,"Оформ.докум.ГОСТ","Рогальская / Степанова","25/26"],[2,"МДК 02.03","Петраш Е.В.","24"],[3,"Способы поис.раб","Гневашева Т.В.","50"],[4,"МДК 03.01","Степанова Ю.В.","25"]], 4: [[1,"МДК 03.02","Степанова Ю.В.","26"],[2,"МДК 02.03","Петраш Е.В.","24"],[3,"МДК 03.02","Степанова Ю.В.","26"],[4,"Физ.культ.","Корольченко П.В.","с/з"]], 5: [[2,"Способы поис.раб","Гневашева Т.В.","50"],[3,"Прав.обесп.проф.","Квитко Е.А.","14"],[4,"МДК 03.01","Степанова Ю.В.","26"]], 6: [[2,"МДК 02.02","Петраш","дист."],[3,"МДК 03.01","Степанова","дист."],[4,"МДК 03.02","Степанова","дист."]] },
  "ТОР-23": { 1: [[0,"Классный час","",""],[1,"МДК 01.04","Камкова Н.И.","13"],[2,"МДК 02.02","Лесина Т.Р.","31"],[3,"МДК 02.02","Лесина Т.Р.","31"]], 2: [[1,"МДК 01.02","Красиков А.Н.","13"],[2,"Психология общ.","Гневашева Т.В.","50"],[3,"МДК 02.02","Лесина Т.Р.","31"]], 3: [[1,"Англ. язык","Соколова Е.Ю.","61"],[2,"МДК 01.06","Камкова Н.И.","13"],[3,"МДК 01.06","Камкова Н.И.","13"],[4,"МДК 02.01","Красиков А.Н.","рес.ц"]], 4: [[1,"МДК 01.03","Камкова Н.И.","13"],[2,"Оформ.докум.ГОСТ","Рогальская / Камкова","25/23"],[3,"Психология общ.","Гневашева Т.В.","50"],[4,"МДК 01.03","Камкова Н.И.","13"]], 5: [[1,"Физ.культ.","Сидоров Г.Н.","с/з 6к"],[2,"Охр. труда","Красиков А.Н.","13"],[3,"Охр. труда","Красиков А.Н.","13"]], 6: [[1,"МДК 01.06","Камкова","дист."],[2,"МДК 02.02","Лесина","дист."],[3,"МДК 01.06","Камкова","дист."]] }
};

const BG_PRESETS = {
  default:  { name: "Стандарт", light: "#f1f5f9", dark: "#0b1120" },
  aurora:   { name: "Аврора",  light: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", dark: "linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)" },
  ocean:    { name: "Океан",   light: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)", dark: "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)" },
  sunset:   { name: "Закат",   light: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", dark: "linear-gradient(135deg, #3a1c71 0%, #d76d77 100%)" },
  forest:   { name: "Лес",     light: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)", dark: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
  midnight: { name: "Ночь",    light: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", dark: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }
};

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const PAIR_NUMS = [0, 1, 2, 3, 4, 5];
const PAIR_NAMES = { 0: "Кл. час", 1: "1 пара", 2: "2 пара", 3: "3 пара", 4: "4 пара", 5: "5 пара" };

const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
  json(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  setJson(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

let customGroups = LS.json("kgst_custom_groups", []);
let hiddenGroups = LS.json("kgst_hidden_groups", []);
let userSchedule = LS.json("kgst_schedule_custom", {});
let gradesData = LS.json("kgst_grades", []); 

function getAllGroupNames() { return [...Object.keys(DEFAULT_SCHEDULE), ...customGroups]; }
function getVisibleGroupNames() {
  const all = getAllGroupNames();
  const visible = all.filter(g => !hiddenGroups.includes(g));
  return visible.length > 0 ? visible : [all[0]];
}
function getSchedule(group) {
  if (userSchedule[group]) return { ...(DEFAULT_SCHEDULE[group] || {}), ...userSchedule[group] };
  return DEFAULT_SCHEDULE[group] || {};
}
function setScheduleDay(group, day, dayData) {
  if (!userSchedule[group]) userSchedule[group] = {};
  if (dayData.length === 0) delete userSchedule[group][day];
  else userSchedule[group][day] = dayData;
  LS.setJson("kgst_schedule_custom", userSchedule);
}
function resetScheduleDay(group, day) {
  if (userSchedule[group]) {
    delete userSchedule[group][day];
    if (Object.keys(userSchedule[group]).length === 0) delete userSchedule[group];
    LS.setJson("kgst_schedule_custom", userSchedule);
  }
}

let selectedGroup = LS.get("kgst_group", "СЭЗ-25");
let selectedDay = Math.min(Math.max(new Date().getDay(), 1), 6);
let weekMode = LS.get("kgst_week_mode", "auto");
let fontScale = LS.get("kgst_font_scale", "1");
let cardOpacity = LS.get("kgst_card_opacity", "1");
let bgPreset = LS.get("kgst_bg_preset", "default");
let bgCustom = LS.get("kgst_bg_custom", "");
let currentNoteKey = "";
let editorGroup = "СЭЗ-25";
let editorDay = 1;

const dom = {
  weekBanner: document.getElementById("weekBanner"),
  weekIcon: document.getElementById("weekIcon"),
  weekLabel: document.getElementById("weekLabel"),
  weekModePill: document.getElementById("weekModePill"),
  liveStatus: document.getElementById("liveStatus"),
  headerTime: document.getElementById("headerTime"),
  daysBar: document.getElementById("daysBar"),
  scheduleList: document.getElementById("scheduleList"),
  noteModal: document.getElementById("noteModal"),
  settingsModal: document.getElementById("settingsModal"),
  editorModal: document.getElementById("editorModal"),
  dashboardModal: document.getElementById("dashboardModal"),
  groupSelect: document.getElementById("groupSelect")
};

function toSec(t) { const [h, m] = t.split(":").map(Number); return h * 3600 + m * 60; }
function getISOWeekNumber(d) {
  const date = new Date(d); date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}
function isTopWeek() {
  if (weekMode === "top") return true;
  if (weekMode === "bot") return false;
  return getISOWeekNumber(new Date()) % 2 === 0;
}

function isDarkNow() {
  const t = document.documentElement.getAttribute("data-theme");
  if (t === "dark") return true;
  if (t === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme() {
  applyBackground();
}

function applyBackground() {
  const dark = isDarkNow();
  const baseColor = dark ? "#0b1120" : "#f1f5f9";
  let bgImage = "none";
  let overlay = "transparent";

  if (bgPreset === "custom" && bgCustom) {
    bgImage = `url("${bgCustom.replace(/"/g, '\\"')}")`;
    overlay = dark ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.25)";
  } else {
    const p = BG_PRESETS[bgPreset] || BG_PRESETS.default;
    const val = dark ? p.dark : p.light;
    if (val && val.indexOf("gradient") !== -1) bgImage = val;
  }

  const root = document.documentElement.style;
  root.setProperty("--bg-layer-bg", baseColor);
  root.setProperty("--bg-layer-image", bgImage);
  root.setProperty("--bg-overlay", overlay);
  root.setProperty("--bg", baseColor);
}

function applyFontScale(scale) {
  fontScale = String(scale);
  document.documentElement.style.setProperty("--scale", fontScale);
  LS.set("kgst_font_scale", fontScale);
  document.querySelectorAll("#fontSizeControl .seg-btn").forEach(b => b.classList.toggle("active", b.dataset.scale === fontScale));
}
function applyCardOpacity(op) {
  cardOpacity = String(op);
  document.documentElement.style.setProperty("--card-opacity", cardOpacity);
  LS.set("kgst_card_opacity", cardOpacity);
  document.querySelectorAll("#opacityControl .seg-btn").forEach(b => b.classList.toggle("active", b.dataset.opacity === cardOpacity));
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }
function refreshGroupSelect() {
  const visible = getVisibleGroupNames();
  if (!visible.includes(selectedGroup)) { selectedGroup = visible[0]; LS.set("kgst_group", selectedGroup); }
  dom.groupSelect.innerHTML = visible.map(g => `<option value="${escapeHtml(g)}" ${g === selectedGroup ? "selected" : ""}>${escapeHtml(g)}</option>`).join("");
}

function renderDays() {
  dom.daysBar.innerHTML = "";
  DAYS.forEach((d, idx) => {
    const dayNum = idx + 1;
    const btn = document.createElement("button");
    btn.className = "day-btn" + (dayNum === selectedDay ? " active" : "");
    btn.textContent = d;
    btn.onclick = () => { selectedDay = dayNum; renderDays(); renderSchedule(); };
    dom.daysBar.appendChild(btn);
  });
}

let cachedCards = [];
function renderSchedule() {
  const top = isTopWeek();
  dom.weekBanner.classList.toggle("bottom-week", !top);
  dom.weekIcon.textContent = top ? "🔼" : "🔽";
  dom.weekLabel.textContent = top ? "Верхняя неделя" : "Нижняя неделя";
  dom.weekModePill.textContent = weekMode === "auto" ? "Авто" : "Вручную";

  dom.scheduleList.innerHTML = "";
  cachedCards = [];

  const groupSchedule = getSchedule(selectedGroup);
  const dayData = (groupSchedule && groupSchedule[selectedDay]) || [];
  const bells = selectedDay === 1 ? BELLS.monday : BELLS.regular;

  if (dayData.length === 0) {
    dom.scheduleList.innerHTML = `<div class="card" style="text-align:center; cursor:default;"><div class="subject" style="margin:0;">В этот день пар нет</div></div>`;
    return;
  }

  dayData.forEach((item, index) => {
    const [pairNum, subjRaw, teacher, room] = item;
    const bell = bells.find(b => b.num === pairNum);
    const timeText = bell ? `${bell.start} – ${bell.end}` : "—";
    const subjectName = typeof subjRaw === "object" ? (top ? subjRaw.top : subjRaw.bot) : subjRaw;
    const noteKey = `note_${selectedGroup}_${selectedDay}_${pairNum}`;
    const savedNote = LS.get(noteKey, "");

    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty('--delay', (index * 0.05) + 's'); 
    
    card.innerHTML = `
      <div class="card-top">
        <span>${pairNum === 0 ? "Классный час" : pairNum + " пара"} • ${timeText}<span class="live-pill" style="display:none;"><span class="live-dot"></span>Сейчас</span></span>
        ${room ? `<span class="room-badge">Каб. ${escapeHtml(room)}</span>` : ""}
      </div>
      <div class="subject"></div>
      <div class="teacher" style="${teacher ? "" : "height:6px; margin:0;"}"></div>
      <div class="note-box ${savedNote ? "has-note" : ""}">
        <span>${savedNote ? "📝" : "✏️"}</span><span class="note-text"></span>
      </div>`;

    card.querySelector(".subject").textContent = subjectName || "(без названия)";
    if (teacher) card.querySelector(".teacher").textContent = teacher;
    card.querySelector(".note-text").textContent = savedNote || "Сделать заметку";

    card.onclick = () => {
      openNoteModal(noteKey, subjectName, pairNum === 0 ? "Классный час" : `${pairNum} пара`, savedNote);
    };

    dom.scheduleList.appendChild(card);
    cachedCards.push({ el: card, pill: card.querySelector(".live-pill"), pair: pairNum, isCurrent: false });

    if (index < dayData.length - 1) {
      const nextPairNum = dayData[index + 1][0];
      const nextBell = bells.find(b => b.num === nextPairNum);
      if (bell && nextBell) {
        const mins = Math.round((toSec(nextBell.start) - toSec(bell.end)) / 60);
        if (mins > 0) {
          const brk = document.createElement("div");
          brk.className = "break-card";
          brk.style.setProperty('--delay', (index * 0.05 + 0.05) + 's');
          brk.innerHTML = `<span>☕ Перемена (${mins} мин)</span><span>${bell.end} – ${nextBell.start}</span>`;
          dom.scheduleList.appendChild(brk);
        }
      }
    }
  });
}

function getActiveBells(group, day) {
  const schedule = getSchedule(group);
  const dayData = (schedule && schedule[day]) || [];
  if (dayData.length === 0) return [];
  const pairNums = new Set(dayData.map(x => x[0]));
  const all = day === 1 ? BELLS.monday : BELLS.regular;
  return all.filter(b => pairNums.has(b.num));
}

let lastState = "";
function updateLive() {
  if (document.hidden) return;
  const now = new Date();
  const today = now.getDay();
  const secNow = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  if (dom.headerTime.textContent !== timeStr) {
    dom.headerTime.textContent = timeStr;
  }

  if (today === 0) {
    updateUI("Воскресенье", "— : —", false);
    return;
  }

  const bells = getActiveBells(selectedGroup, today);
  if (bells.length === 0) {
    updateUI("Сегодня пар нет", "— : —", false);
    return;
  }

  let activePairNum = null;
  let stateText = "Занятия окончены";
  let isBreak = false;
  let diffSec = 0;

  for (let i = 0; i < bells.length; i++) {
    const start = toSec(bells[i].start);
    const end = toSec(bells[i].end);

    if (secNow < start) {
      if (i === 0) {
        stateText = `Ожидание (${bells[i].name})`;
        diffSec = start - secNow;
      } else {
        isBreak = true;
        stateText = `Перемена (до ${bells[i].name})`;
        diffSec = start - secNow;
      }
      break;
    } else if (secNow >= start && secNow <= end) {
      activePairNum = bells[i].num;
      stateText = `Идёт ${bells[i].name}`;
      diffSec = end - secNow;
      break;
    }
  }

  let timerStr = "Отдых";
  if (diffSec > 0) {
    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    const s = diffSec % 60;
    timerStr = (h > 0 ? `${h}ч ` : "") + `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  
  updateUI(stateText, timerStr, isBreak);

  const isToday = selectedDay === today;
  for (const c of cachedCards) {
    const shouldBeCurrent = isToday && c.pair === activePairNum;
    if (c.isCurrent !== shouldBeCurrent) {
      c.isCurrent = shouldBeCurrent;
      c.el.classList.toggle("current", shouldBeCurrent);
      c.pill.style.display = shouldBeCurrent ? "inline-flex" : "none";
    }
  }
}

function updateUI(stateText, timerStr, isBreak) {
  const newStateKey = stateText + timerStr;
  if (lastState === newStateKey) return;
  lastState = newStateKey;

  dom.liveStatus.textContent = stateText;
  dom.liveStatus.style.color = isBreak ? "var(--green)" : "var(--accent)";
  dom.headerTime.textContent = timerStr;
}

function openAnimatedDialog(dlg) {
  if (dlg.open) return;
  dlg.showModal();
  requestAnimationFrame(() => dlg.classList.add("is-open"));
}
function closeAnimatedDialog(dlg) {
  if (!dlg.open) return;
  dlg.classList.remove("is-open");
  setTimeout(() => dlg.close(), 210);
}

document.getElementById("openDashboardBtn").onclick = () => { renderHomework(); renderGrades(); openAnimatedDialog(dom.dashboardModal); };
document.getElementById("openDashboardBtn2").onclick = () => { renderHomework(); renderGrades(); openAnimatedDialog(dom.dashboardModal); };
document.getElementById("closeDashboardBtn").onclick = () => closeAnimatedDialog(dom.dashboardModal);
dom.dashboardModal.onclick = (e) => { if (e.target === dom.dashboardModal) closeAnimatedDialog(dom.dashboardModal); };

document.querySelectorAll(".dash-tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".dash-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".dash-content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  };
});

function renderHomework() {
  const container = document.getElementById("hwList");
  container.innerHTML = "";
  let hasNotes = false;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("note_")) {
      hasNotes = true;
      const parts = key.split("_");
      const group = parts[1]; const dayNum = parseInt(parts[2]); const pairNum = parseInt(parts[3]);
      const text = localStorage.getItem(key);
      const dayName = DAYS[dayNum - 1] || "?";
      const pairName = PAIR_NAMES[pairNum] || "?";

      const el = document.createElement("div");
      el.className = "hw-item";
      el.innerHTML = `<div class="hw-item-title">${group} • ${dayName} • ${pairName}</div><div>${escapeHtml(text)}</div>`;
      container.appendChild(el);
    }
  }

  if (!hasNotes) container.innerHTML = `<div style="text-align:center; color:var(--muted); font-size:13px; padding:20px;">Нет заметок. Нажмите на пару, чтобы добавить ДЗ.</div>`;
}

document.getElementById("addGradeBtn").onclick = () => {
  const subj = document.getElementById("gradeSubject").value.trim();
  const val = parseInt(document.getElementById("gradeValue").value);
  const note = document.getElementById("gradeNote").value.trim();
  if (!subj || isNaN(val) || val < 2 || val > 5) return alert("Введите предмет и оценку (2-5).");
  gradesData.push({ id: Date.now(), subject: subj, value: val, note: note });
  LS.setJson("kgst_grades", gradesData);
  document.getElementById("gradeSubject").value = ""; document.getElementById("gradeValue").value = ""; document.getElementById("gradeNote").value = "";
  renderGrades();
};

function renderGrades() {
  const list = document.getElementById("gradesList");
  list.innerHTML = "";
  if (gradesData.length === 0) {
    list.innerHTML = `<div style="text-align:center; color:var(--muted); font-size:13px;">Оценок пока нет.</div>`;
    document.getElementById("gpaValue").textContent = "0.00";
    return;
  }
  let sum = 0;
  gradesData.sort((a, b) => b.id - a.id);
  gradesData.forEach(g => {
    sum += g.value;
    const el = document.createElement("div");
    el.className = "grade-item";
    el.innerHTML = `
      <div class="grade-val g${g.value}">${g.value}</div>
      <div class="grade-info"><div class="grade-subj">${escapeHtml(g.subject)}</div>${g.note ? `<div class="grade-note">${escapeHtml(g.note)}</div>` : ""}</div>
      <button class="btn btn-danger" style="padding:4px 8px; font-size:12px;" onclick="deleteGrade(${g.id})">✕</button>
    `;
    list.appendChild(el);
  });
  document.getElementById("gpaValue").textContent = (sum / gradesData.length).toFixed(2);
}
window.deleteGrade = function(id) { gradesData = gradesData.filter(g => g.id !== id); LS.setJson("kgst_grades", gradesData); renderGrades(); };

function openNoteModal(key, title, subtitle, text) {
  currentNoteKey = key;
  document.getElementById("modalTitle").textContent = title || "Заметка";
  document.getElementById("modalSub").textContent = `${selectedGroup} • ${subtitle}`;
  document.getElementById("noteInput").value = text || "";
  document.getElementById("deleteNote").style.display = text ? "block" : "none";
  openAnimatedDialog(dom.noteModal);
}
document.getElementById("closeModal").onclick = () => closeAnimatedDialog(dom.noteModal);
dom.noteModal.onclick = (e) => { if (e.target === dom.noteModal) closeAnimatedDialog(dom.noteModal); };
document.getElementById("saveNote").onclick = () => {
  const val = document.getElementById("noteInput").value.trim();
  if (val) LS.set(currentNoteKey, val); else LS.del(currentNoteKey);
  closeAnimatedDialog(dom.noteModal); renderSchedule();
};
document.getElementById("deleteNote").onclick = () => {
  LS.del(currentNoteKey); closeAnimatedDialog(dom.noteModal); renderSchedule();
};

document.getElementById("openSettingsBtn").onclick = () => {
  document.querySelectorAll("#weekModeControl .seg-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.wmode === weekMode));
  renderBackgroundGrid(); applyFontScale(fontScale); applyCardOpacity(cardOpacity);
  openAnimatedDialog(dom.settingsModal);
};
document.getElementById("closeSettingsBtn").onclick = () => closeAnimatedDialog(dom.settingsModal);
dom.settingsModal.onclick = (e) => { if (e.target === dom.settingsModal) closeAnimatedDialog(dom.settingsModal); };

document.querySelectorAll("#fontSizeControl .seg-btn").forEach(btn => btn.onclick = () => applyFontScale(btn.dataset.scale));
document.querySelectorAll("#opacityControl .seg-btn").forEach(btn => btn.onclick = () => applyCardOpacity(btn.dataset.opacity));
document.querySelectorAll("#weekModeControl .seg-btn").forEach(btn => {
  btn.onclick = () => { weekMode = btn.dataset.wmode; LS.set("kgst_week_mode", weekMode); document.querySelectorAll("#weekModeControl .seg-btn").forEach(b => b.classList.toggle("active", b.dataset.wmode === weekMode)); renderSchedule(); };
});

function renderBackgroundGrid() {
  const grid = document.getElementById("bgGrid"); grid.innerHTML = ""; const dark = isDarkNow();
  Object.entries(BG_PRESETS).forEach(([key, p]) => {
    const el = document.createElement("div"); el.className = "bg-option" + (bgPreset === key ? " active" : "");
    const val = dark ? p.dark : p.light;
    if (val.indexOf("gradient") !== -1) el.style.backgroundImage = val; else el.style.backgroundColor = val;
    el.textContent = p.name;
    el.onclick = () => { bgPreset = key; LS.set("kgst_bg_preset", bgPreset); applyBackground(); renderBackgroundGrid(); };
    grid.appendChild(el);
  });
  const custom = document.createElement("div"); custom.className = "bg-option bg-custom" + (bgPreset === "custom" ? " active" : "");
  if (bgPreset === "custom" && bgCustom) { custom.style.backgroundImage = `url("${bgCustom}")`; custom.style.backgroundSize = "cover"; custom.style.backgroundPosition = "center"; custom.textContent = ""; }
  else custom.textContent = "🖼 Своё фото";
  custom.onclick = () => { if (!bgCustom) document.getElementById("bgFileInput").click(); else { bgPreset = "custom"; LS.set("kgst_bg_preset", bgPreset); applyBackground(); renderBackgroundGrid(); } };
  grid.appendChild(custom);
}

document.getElementById("bgFileInput").addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1400; let w = img.width, h = img.height;
      if (Math.max(w, h) > MAX) { const k = MAX / Math.max(w, h); w = Math.round(w * k); h = Math.round(h * k); }
      const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(img, 0, 0, w, h);
      bgCustom = c.toDataURL("image/jpeg", 0.82);
      try { LS.set("kgst_bg_custom", bgCustom); } catch { alert("Картинка слишком большая."); return; }
      bgPreset = "custom"; LS.set("kgst_bg_preset", bgPreset); applyBackground(); renderBackgroundGrid();
    }; img.src = ev.target.result;
  }; reader.readAsDataURL(file); e.target.value = "";
});

document.getElementById("addGroupBtn").onclick = () => {
  const input = document.getElementById("newGroupInput"); const name = input.value.trim().toUpperCase(); if (!name) return;
  if (!getAllGroupNames().includes(name)) { customGroups.push(name); LS.setJson("kgst_custom_groups", customGroups); }
  hiddenGroups = hiddenGroups.filter(g => g !== name); LS.setJson("kgst_hidden_groups", hiddenGroups);
  selectedGroup = name; LS.set("kgst_group", selectedGroup); input.value = "";
  renderSettingsGroups(); refreshGroupSelect(); renderSchedule();
};

applyTheme(); applyFontScale(fontScale); applyCardOpacity(cardOpacity); applyBackground();
refreshGroupSelect(); renderDays(); renderSchedule();
setInterval(updateLive, 1000);

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (LS.get("kgst_theme", "system") === "system") applyTheme(); });
dom.groupSelect.onchange = () => { selectedGroup = dom.groupSelect.value; LS.set("kgst_group", selectedGroup); renderSchedule(); };
document.addEventListener("visibilitychange", () => { if (!document.hidden) updateLive(); });
