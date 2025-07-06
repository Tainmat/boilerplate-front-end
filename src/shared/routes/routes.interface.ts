export interface IRouteProps {
  path: string;
  component: React.LazyExoticComponent<any>;
  isPrivate?: boolean;
  allowedRoles?: string[];
}
