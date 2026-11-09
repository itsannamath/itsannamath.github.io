// Колоди карток. Кожна картка: [питання, відповідь] у LaTeX.
// Текст усередині формули — через \text{...}.
// Поки що це колоди-приклади; повні колоди додамо після обговорення формул.
module.exports = [
  {
    id: 'tryg', title: 'Тригонометрія', sub: 'тотожності, подвійний кут, радіани',
    cards: [
      ['\\sin^2\\alpha+\\cos^2\\alpha=\\ ?', '1'],
      ['1+\\operatorname{tg}^2\\alpha=\\ ?', '\\dfrac{1}{\\cos^2\\alpha}'],
      ['\\sin2\\alpha=\\ ?', '2\\sin\\alpha\\cos\\alpha'],
      ['\\cos2\\alpha=\\ ?', '\\cos^2\\alpha-\\sin^2\\alpha'],
      ['\\cos(\\alpha+\\beta)=\\ ?', '\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta'],
      ['\\pi\\ \\text{рад}=\\ ?', '180^\\circ'],
    ],
  },
  {
    id: 'log', title: 'Логарифми', sub: 'властивості, рівняння, ОДЗ',
    cards: [
      ['\\log_a x+\\log_a y=\\ ?', '\\log_a xy'],
      ['\\log_a b^p=\\ ?', 'p\\log_a b'],
      ['\\log_a f(x)=b\\ \\Rightarrow\\ ?', 'f(x)=a^b'],
      ['\\text{ОДЗ}:\\ \\log_a f(x)', 'f(x)>0,\\quad a>0,\\ a\\ne1'],
    ],
  },
];
