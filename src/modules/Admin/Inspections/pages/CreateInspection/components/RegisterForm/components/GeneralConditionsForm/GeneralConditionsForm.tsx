import { useFormikContext } from "formik";
import { Card, Col, Row } from "react-bootstrap";
import ReactQuill from "react-quill-new";

import { Heading } from "@/shared/components/Core/Typography/Heading";
import { useAuthRoles } from "@/shared/hooks/services/Rules/Auth/useRoles";

import { IInspectionRegisterForm } from "../../RegisterForm.form";

export function GeneralConditionsForm() {
  const { values, setFieldValue } = useFormikContext<IInspectionRegisterForm>();
  const { isInspectionChanger } = useAuthRoles();

  const colors: string[] = [
    "#000000",
    "#333333",
    "#666666",
    "#999999",
    "#cccccc",
    "#2c3e50",
    "#000099",
    "#3498db",
    "#e74c3c",
    "#f1c0c0",
    "#f39c12",
    "#fff2cc",
    "#27ae60",
    "#c8e6c9",
  ];

  const executiveConfig = {
    toolbar: [
      // Formatação de texto
      ["bold", "italic", "underline"],

      // Paleta de cores corporativas (texto)
      [
        {
          color: colors,
        },
      ],

      // Paleta de cores de fundo
      [
        {
          background: colors,
        },
      ],

      // Listas organizadas
      [{ list: "ordered" }, { list: "bullet" }],

      // Alinhamento profissional
      [{ align: ["", "center", "right", "justify"] }],

      // Links e citações
      ["link", "blockquote"],

      // Utilitários
      ["clean"],
    ],
  };

  return (
    <Card className="shadow-sm" style={{ borderLeft: "4px solid #047a32" }}>
      <Card.Body>
        <div className="border-bottom pb-3 mb-4" style={{ borderColor: "#047a32" }}>
          <Heading size="sm" className="mb-1 fw-bold text-success">
            6. Considerações Gerais
          </Heading>
          <small className="text-muted">
            Observações importantes sobre as condições de inspeção
          </small>
        </div>
        <Row className="g-3">
          <Col xs={12}>
            <ReactQuill
              readOnly={!isInspectionChanger()}
              className="text-editor"
              theme="snow"
              value={values.finalConclusion}
              onChange={(e) => setFieldValue("finalConclusion", e)}
              modules={executiveConfig}
            />
            <div className="d-flex justify-content-end mt-2">
              <small
                className={`${
                  (values.finalConclusion?.length || 0) > 2048
                    ? "text-danger"
                    : (values.finalConclusion?.length || 0) > 1800
                      ? "text-warning"
                      : "text-muted"
                }`}
              >
                {values.finalConclusion?.length || 0} / 2048
              </small>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
