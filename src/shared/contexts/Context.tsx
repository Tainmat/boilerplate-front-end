import { AlertContext } from "@shared/contexts/Alert";
import { AuthContext } from "@shared/contexts/Auth";
import { BreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { ContentContext } from "@shared/contexts/Layout/Content";
import { HeaderContext } from "@shared/contexts/Layout/Header";
import { ModalContext } from "@shared/contexts/Layout/Modal";
import { SideMenuContext } from "@shared/contexts/Layout/SideMenu";
import { LoaderContext } from "@shared/contexts/Loader";
import { RefreshKeyContext } from "@shared/contexts/Refresh";
import { ToastContext } from "@shared/contexts/Toast";
import { ReactNode } from "react";
import { CustomerContext } from "./Customer";

interface Props {
  children: ReactNode;
}

export function Contexts({ children }: Props) {
  return (
    <RefreshKeyContext>
      <LoaderContext>
        <AuthContext>
          <ModalContext>
            <HeaderContext>
              <BreadcrumbContext>
                <SideMenuContext>
                  <ContentContext>
                    <ToastContext>
                      <CustomerContext>
                        <AlertContext>{children}</AlertContext>
                      </CustomerContext>
                    </ToastContext>
                  </ContentContext>
                </SideMenuContext>
              </BreadcrumbContext>
            </HeaderContext>
          </ModalContext>
        </AuthContext>
      </LoaderContext>
    </RefreshKeyContext>
  );
}
