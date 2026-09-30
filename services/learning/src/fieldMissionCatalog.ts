// Web reward catalog. Legacy mobile Psychology/Stoicism IDs are intentionally absent.
export const FIELD_MISSION_CATALOG: Record<string, { lessonXP: number; description: [string, string]; steps: Array<[string, string]>; prompt: [string, string]; kinds: Array<'camera' | 'screenshot' | 'text'> }> = {
  "learn-money-01": {
    "lessonXP": 120,
    "description": [
      "Separa hoy tu colchón del capital disponible y deja una regla visible.",
      "Separate your buffer from available capital today and leave a visible rule."
    ],
    "steps": [
      [
        "Abre tu app bancaria o presupuesto.",
        "Open your bank or budgeting app."
      ],
      [
        "Etiqueta el colchón y el excedente.",
        "Label the buffer and surplus."
      ],
      [
        "Guarda una captura o explica la regla aplicada.",
        "Save a screenshot or explain the applied rule."
      ]
    ],
    "prompt": [
      "La evidencia debe mostrar una separación o regla concreta, sin exponer números sensibles.",
      "Evidence must show a concrete separation or rule without exposing sensitive numbers."
    ],
    "kinds": [
      "screenshot",
      "text"
    ]
  },
  "learn-money-02": {
    "lessonXP": 130,
    "description": [
      "Configura un aporte recurrente real o simulado.",
      "Configure a real or simulated recurring contribution."
    ],
    "steps": [
      [
        "Abre tu broker, simulador o calendario.",
        "Open your broker, simulator, or calendar."
      ],
      [
        "Configura monto y frecuencia.",
        "Set amount and frequency."
      ],
      [
        "Captura la confirmación sin datos privados.",
        "Capture confirmation without private data."
      ]
    ],
    "prompt": [
      "Muestra monto, frecuencia y fecha de inicio.",
      "Show amount, frequency, and start date."
    ],
    "kinds": [
      "camera",
      "screenshot",
      "text"
    ]
  },
  "learn-money-03": {
    "lessonXP": 140,
    "description": [
      "Compara dos ETF y documenta cuál supera tu filtro.",
      "Compare two ETFs and document which one passes your filter."
    ],
    "steps": [
      [
        "Busca dos fondos comparables.",
        "Find two comparable funds."
      ],
      [
        "Registra índice y ratio de gastos.",
        "Record index and expense ratio."
      ],
      [
        "Selecciona uno con una razón verificable.",
        "Choose one with a verifiable reason."
      ]
    ],
    "prompt": [
      "La prueba debe incluir dos opciones y una decisión.",
      "Proof must include two options and one decision."
    ],
    "kinds": [
      "screenshot",
      "text"
    ]
  },
  "learn-money-04": {
    "lessonXP": 150,
    "description": [
      "Programa tu regla DCA en un sistema que te la recuerde o ejecute.",
      "Schedule your DCA rule in a system that reminds or executes it."
    ],
    "steps": [
      [
        "Elige broker, calendario o recordatorio.",
        "Choose broker, calendar, or reminder."
      ],
      [
        "Programa monto y fecha.",
        "Schedule amount and date."
      ],
      [
        "Captura la configuración.",
        "Capture the setup."
      ]
    ],
    "prompt": [
      "Muestra una recurrencia concreta; puedes ocultar saldos.",
      "Show a concrete recurrence; balances may be hidden."
    ],
    "kinds": [
      "camera",
      "screenshot"
    ]
  },
  "learn-money-05": {
    "lessonXP": 170,
    "description": [
      "Escribe y guarda tu regla de riesgo antes de la próxima operación.",
      "Write and save your risk rule before the next trade."
    ],
    "steps": [
      [
        "Define pérdida máxima.",
        "Define maximum loss."
      ],
      [
        "Define tamaño y salida.",
        "Define size and exit."
      ],
      [
        "Guarda la regla en tu bitácora.",
        "Save the rule in your journal."
      ]
    ],
    "prompt": [
      "Incluye pérdida máxima y condición de salida.",
      "Include maximum loss and exit condition."
    ],
    "kinds": [
      "screenshot",
      "text"
    ]
  },
  "learn-ai-01": {
    "lessonXP": 120,
    "description": [
      "Ejecuta tu prompt de cuatro bloques en un modelo y conserva el resultado.",
      "Run your four-block prompt in a model and keep the result."
    ],
    "steps": [
      [
        "Copia la plantilla.",
        "Copy the template."
      ],
      [
        "Ejecútala con una tarea real.",
        "Run it on a real task."
      ],
      [
        "Captura prompt y salida útil.",
        "Capture the prompt and useful output."
      ]
    ],
    "prompt": [
      "La evidencia debe mostrar que el prompt fue ejecutado.",
      "Evidence must show that the prompt was executed."
    ],
    "kinds": [
      "screenshot",
      "text"
    ]
  },
  "learn-ai-02": {
    "lessonXP": 130,
    "description": [
      "Usa tu paquete de contexto para mejorar una respuesta real.",
      "Use your context pack to improve a real response."
    ],
    "steps": [
      [
        "Ejecuta una petición sin contexto.",
        "Run a request without context."
      ],
      [
        "Añade tu paquete de tres capas.",
        "Add your three-layer context pack."
      ],
      [
        "Documenta la diferencia útil.",
        "Document the useful difference."
      ]
    ],
    "prompt": [
      "Compara antes y después con una diferencia concreta.",
      "Compare before and after with one concrete difference."
    ],
    "kinds": [
      "screenshot",
      "text"
    ]
  },
  "learn-ai-03": {
    "lessonXP": 140,
    "description": [
      "Aplica tu regla de ruteo a una tarea repetitiva esta semana.",
      "Apply your routing rule to one repetitive task this week."
    ],
    "steps": [
      [
        "Elige una tarea real.",
        "Choose a real task."
      ],
      [
        "Asigna modelo y aprobación.",
        "Assign model and approval."
      ],
      [
        "Ejecuta una prueba.",
        "Run one test."
      ]
    ],
    "prompt": [
      "Muestra tarea, ruta elegida y resultado de la prueba.",
      "Show task, selected route, and test result."
    ],
    "kinds": [
      "screenshot",
      "text"
    ]
  },
  "learn-ai-04": {
    "lessonXP": 150,
    "description": [
      "Configura el primer paso de tu flujo trigger-transform-action.",
      "Configure the first step of your trigger-transform-action workflow."
    ],
    "steps": [
      [
        "Abre Make, Zapier, n8n o equivalente.",
        "Open Make, Zapier, n8n, or equivalent."
      ],
      [
        "Configura trigger y una acción de prueba.",
        "Configure a trigger and one test action."
      ],
      [
        "Ejecuta y captura el log.",
        "Run and capture the log."
      ]
    ],
    "prompt": [
      "La prueba debe mostrar un trigger ejecutado y su salida.",
      "Proof must show an executed trigger and its output."
    ],
    "kinds": [
      "camera",
      "screenshot"
    ]
  },
  "learn-ai-05": {
    "lessonXP": 170,
    "description": [
      "Implementa un límite real en tu agente o automatización.",
      "Implement one real limit in your agent or automation."
    ],
    "steps": [
      [
        "Elige una acción de riesgo.",
        "Choose one risky action."
      ],
      [
        "Añade aprobación o límite.",
        "Add approval or a limit."
      ],
      [
        "Prueba que el agente se detenga.",
        "Test that the agent stops."
      ]
    ],
    "prompt": [
      "Muestra el guardrail y una prueba de su comportamiento.",
      "Show the guardrail and a test of its behavior."
    ],
    "kinds": [
      "screenshot",
      "text"
    ]
  },
  "learn-psychology-v1-01": {
    "lessonXP": 120,
    "description": [
      "Pon a prueba una creencia real buscando evidencia que pueda refutarla.",
      "Test a real belief by seeking evidence that could disprove it."
    ],
    "steps": [
      [
        "Escribe la creencia sin defenderla.",
        "Write the belief without defending it."
      ],
      [
        "Define qué evidencia cambiaría tu opinión.",
        "Define what evidence would change your mind."
      ],
      [
        "Ejecuta o agenda una prueba concreta.",
        "Run or schedule one concrete test."
      ]
    ],
    "prompt": [
      "Muestra la creencia, la evidencia contraria y la prueba elegida.",
      "Show the belief, contrary evidence, and selected test."
    ],
    "kinds": [
      "screenshot",
      "text"
    ]
  },
  "learn-psychology-v1-02": {
    "lessonXP": 130,
    "description": [
      "Define una regla previa para una decisión que te produce miedo a perder.",
      "Define a prior rule for a decision that triggers fear of loss."
    ],
    "steps": [
      [
        "Nombra la decisión y el riesgo real.",
        "Name the decision and actual risk."
      ],
      [
        "Fija la pérdida máxima aceptable.",
        "Set the maximum acceptable loss."
      ],
      [
        "Escribe la condición objetiva para avanzar.",
        "Write the objective condition to proceed."
      ]
    ],
    "prompt": [
      "La evidencia debe mostrar el límite y el criterio definidos antes del resultado.",
      "Evidence must show the limit and criterion defined before the outcome."
    ],
    "kinds": [
      "screenshot",
      "text"
    ]
  },
  "learn-psychology-v1-03": {
    "lessonXP": 140,
    "description": [
      "Reevalúa un compromiso actual ignorando el coste que ya no puedes recuperar.",
      "Re-evaluate a current commitment while ignoring the cost you cannot recover."
    ],
    "steps": [
      [
        "Separa el coste pasado del futuro.",
        "Separate past cost from the future."
      ],
      [
        "Compara continuar con tu mejor alternativa.",
        "Compare continuing with your best alternative."
      ],
      [
        "Registra la decisión que tomarías empezando hoy.",
        "Record the decision you would make starting today."
      ]
    ],
    "prompt": [
      "Muestra la comparación futura y la decisión resultante.",
      "Show the forward-looking comparison and resulting decision."
    ],
    "kinds": [
      "screenshot",
      "text"
    ]
  },
  "learn-psychology-v1-04": {
    "lessonXP": 150,
    "description": [
      "Contrasta una historia reciente con una tasa base relevante.",
      "Contrast a recent story with a relevant base rate."
    ],
    "steps": [
      [
        "Captura la afirmación o ejemplo visible.",
        "Capture the visible claim or example."
      ],
      [
        "Busca una fuente con una muestra más amplia.",
        "Find a source with a broader sample."
      ],
      [
        "Actualiza tu conclusión con ambos datos.",
        "Update your conclusion using both pieces of evidence."
      ]
    ],
    "prompt": [
      "Incluye la anécdota, la tasa base y la conclusión revisada.",
      "Include the anecdote, base rate, and revised conclusion."
    ],
    "kinds": [
      "screenshot",
      "text"
    ]
  },
  "learn-psychology-v1-05": {
    "lessonXP": 170,
    "description": [
      "Crea y usa una pregunta de recuperación sobre algo que aprendiste hoy.",
      "Create and use a retrieval prompt for something you learned today."
    ],
    "steps": [
      [
        "Cierra el material original.",
        "Close the original material."
      ],
      [
        "Responde de memoria sin pistas.",
        "Answer from memory without clues."
      ],
      [
        "Comprueba y corrige los huecos.",
        "Check and correct the gaps."
      ]
    ],
    "prompt": [
      "Muestra la pregunta, tu respuesta inicial y la corrección.",
      "Show the prompt, your initial answer, and the correction."
    ],
    "kinds": [
      "screenshot",
      "text"
    ]
  }
};
