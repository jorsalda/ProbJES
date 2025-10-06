import pandas as pd

# -----------------------------
# Datos del problema
# -----------------------------
n_total = 200  # total de estudiantes
counts = {"Lecturas": 80, "Práctica": 70, "Autoestudio": 50}
p_given = {"Lecturas": 0.60, "Práctica": 0.80, "Autoestudio": 0.50}

# -----------------------------
# Construcción de la tabla
# -----------------------------
methods = list(counts.keys())
df = pd.DataFrame({
    "Método": methods,
    "N_estudiantes": [counts[m] for m in methods],
    "P(Método)": [counts[m]/n_total for m in methods],
    "P(Aprobar | Método)": [p_given[m] for m in methods]
})

# Probabilidades conjuntas
df["P(A ∩ Método)"] = df["P(Método)"] * df["P(Aprobar | Método)"]

# Probabilidad total de aprobar
p_aprobar_total = df["P(A ∩ Método)"].sum()

# Teorema de Bayes: P(Método | Aprobar)
df["P(Método | Aprobar)"] = df["P(A ∩ Método)"] / p_aprobar_total

# -----------------------------
# Resultados
# -----------------------------
print("Tabla de probabilidades:\n")
print(df.to_string(index=False))

print("\nProbabilidad total de aprobar (Teorema de la probabilidad total):")
print(f"P(Aprobar) = Σ P(A | Método_i)·P(Método_i) = {p_aprobar_total:.4f}")

print("\nAplicación del Teorema de Bayes (probabilidades posteriores):")
for _, row in df.iterrows():
    metodo = row["Método"]
    p_posterior = row["P(Método | Aprobar)"]
    print(f"P({metodo} | Aprobar) = {p_posterior:.4f}")
