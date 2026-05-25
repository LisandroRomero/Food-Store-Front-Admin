import { useForm } from "@tanstack/react-form";

import { useAuthStore } from "../../store/useAuthStore";

export default function LoginForm() {
  const login = useAuthStore(
    (state) => state.login
  );
  const isLoading = useAuthStore(
    (state) => state.isLoading
  );
  const error = useAuthStore(
    (state) => state.error
  );
  const setError = useAuthStore(
    (state) => state.setError
  );
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await login(
          value.email,
          value.password
        );
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            if (!value) {
              return "El email es obligatorio";
            }

            if (!value.includes("@")) {
              return "Email inválido";
            }

            return undefined;
          },
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={field.state.value}
              onChange={(e) => {
                setError(null);
                field.handleChange(
                  e.target.value
                );
              }}
              onBlur={field.handleBlur}
              className="border rounded px-3 py-2"
            />

            {field.state.meta.isTouched &&
              field.state.meta.errors
                .length > 0 && (
                <p className="text-red-500 text-sm">
                  {
                    field.state.meta
                      .errors[0]
                  }
                </p>
              )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            if (!value) {
              return "La contraseña es obligatoria";
            }
            if (value.length < 6) {
              return "Mínimo 6 caracteres";
            }
            return undefined;
          },
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={field.state.value}
              onChange={(e) => {
                setError(null);

                field.handleChange(
                  e.target.value
                );
              }}
              onBlur={field.handleBlur}
              className="border rounded px-3 py-2"
            />

            {field.state.meta.isTouched &&
              field.state.meta.errors
                .length > 0 && (
                <p className="text-red-500 text-sm">
                  {
                    field.state.meta
                      .errors[0]
                  }
                </p>
              )}
          </div>
        )}
      </form.Field>

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={
          isLoading ||
          !form.state.canSubmit
        }
        className="bg-black text-white py-2 rounded disabled:opacity-50"
      >
        {isLoading
          ? "Ingresando..."
          : "Iniciar sesión"}
      </button>
    </form>
  );
}