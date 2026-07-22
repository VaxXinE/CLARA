import { useEffect, useMemo, useState, type FormEvent } from "react";
import type {
  CustomerMutationPayload,
  CustomerProfileResponse,
} from "../api/types";

type CustomerWorkspacePanelProps = {
  customer: CustomerProfileResponse["customer"] | null;
  customers: CustomerProfileResponse["customer"][];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  mutationError: string | null;
  isSaving: boolean;
  readOnly: boolean;
  onSelectCustomer: (customer: CustomerProfileResponse["customer"]) => void;
  onCreateCustomer: (payload: CustomerMutationPayload) => Promise<void>;
  onUpdateCustomer: (
    customerId: string,
    payload: CustomerMutationPayload,
  ) => Promise<void>;
};

function summarizeSource(customer: CustomerProfileResponse["customer"] | null) {
  if (!customer) {
    return "No channel context";
  }

  return customer.contact_identifier
    ? `${customer.source} · ${customer.contact_identifier}`
    : customer.source;
}

function customerPayloadFromForm(input: {
  displayName: string;
  contactIdentifier: string;
  source: CustomerMutationPayload["source"];
  status: CustomerMutationPayload["status"];
  notesSummary: string;
}): CustomerMutationPayload {
  return {
    displayName: input.displayName.trim(),
    contactIdentifier: input.contactIdentifier.trim() || null,
    source: input.source,
    status: input.status,
    notesSummary: input.notesSummary.trim() || null,
  };
}

export function CustomerWorkspacePanel(props: CustomerWorkspacePanelProps) {
  const [search, setSearch] = useState("");
  const [createDisplayName, setCreateDisplayName] = useState("");
  const [createContact, setCreateContact] = useState("");
  const [createStatus, setCreateStatus] =
    useState<CustomerMutationPayload["status"]>("new");
  const [createNotes, setCreateNotes] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editContact, setEditContact] = useState("");
  const [editStatus, setEditStatus] =
    useState<CustomerMutationPayload["status"]>("new");
  const [editNotes, setEditNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setEditDisplayName(props.customer?.display_name ?? "");
    setEditContact(props.customer?.contact_identifier ?? "");
    setEditStatus(
      (props.customer?.status as CustomerMutationPayload["status"]) ?? "new",
    );
    setEditNotes(props.customer?.notes_summary ?? "");
  }, [props.customer]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return props.customers;
    }

    return props.customers.filter((customer) =>
      [
        customer.display_name,
        customer.contact_identifier,
        customer.source,
        customer.status,
        customer.notes_summary,
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [props.customers, search]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (createDisplayName.trim().length === 0) {
      setFormError("Customer name is required.");
      return;
    }

    await props.onCreateCustomer(
      customerPayloadFromForm({
        displayName: createDisplayName,
        contactIdentifier: createContact,
        source: "demo",
        status: createStatus,
        notesSummary: createNotes,
      }),
    );

    setCreateDisplayName("");
    setCreateContact("");
    setCreateStatus("new");
    setCreateNotes("");
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!props.customer) {
      setFormError("Select a customer before editing.");
      return;
    }

    if (editDisplayName.trim().length === 0) {
      setFormError("Customer name is required.");
      return;
    }

    await props.onUpdateCustomer(
      props.customer.id,
      customerPayloadFromForm({
        displayName: editDisplayName,
        contactIdentifier: editContact,
        source: props.customer.source as CustomerMutationPayload["source"],
        status: editStatus,
        notesSummary: editNotes,
      }),
    );
  }

  return (
    <section
      id="customers"
      className="panel crm-skeleton-panel"
      aria-label="Internal CRM customer workspace"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Internal CRM</p>
          <h2>Customer workspace</h2>
        </div>
        <span className="badge">
          {props.readOnly ? "Read-only" : "Workspace-scoped CRUD"}
        </span>
      </div>

      <div className="customer-crud-grid">
        <section className="state-card">
          <strong>Customer list</strong>
          <label className="field-label" htmlFor="customer-search">
            Search
          </label>
          <input
            id="customer-search"
            className="text-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customer, contact, or notes"
          />

          {props.loading ? <p>Loading customers...</p> : null}
          {props.error ? <p className="error-text">{props.error}</p> : null}
          {!props.loading && !props.error && filteredCustomers.length === 0 ? (
            <p>No customers found. Create the first internal CRM record.</p>
          ) : null}

          <div className="customer-crud-list">
            {filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                type="button"
                className={
                  customer.id === props.customer?.id
                    ? "customer-crud-item is-selected"
                    : "customer-crud-item"
                }
                onClick={() => props.onSelectCustomer(customer)}
              >
                <span>{customer.display_name}</span>
                <small>{summarizeSource(customer)}</small>
              </button>
            ))}
          </div>
        </section>

        <form className="state-card" onSubmit={handleCreate}>
          <strong>Create customer</strong>
          <label className="field-label" htmlFor="create-customer-name">
            Name
          </label>
          <input
            id="create-customer-name"
            className="text-input"
            value={createDisplayName}
            disabled={props.readOnly || props.isSaving}
            onChange={(event) => setCreateDisplayName(event.target.value)}
            placeholder="Customer name"
          />

          <label className="field-label" htmlFor="create-customer-contact">
            Contact
          </label>
          <input
            id="create-customer-contact"
            className="text-input"
            value={createContact}
            disabled={props.readOnly || props.isSaving}
            onChange={(event) => setCreateContact(event.target.value)}
            placeholder="Email, phone, or handle"
          />

          <label className="field-label" htmlFor="create-customer-status">
            Status
          </label>
          <select
            id="create-customer-status"
            className="text-input"
            value={createStatus}
            disabled={props.readOnly || props.isSaving}
            onChange={(event) =>
              setCreateStatus(
                event.target.value as CustomerMutationPayload["status"],
              )
            }
          >
            <option value="new">New</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="blocked">Blocked</option>
          </select>

          <label className="field-label" htmlFor="create-customer-notes">
            Notes preview
          </label>
          <textarea
            id="create-customer-notes"
            className="text-input"
            value={createNotes}
            disabled={props.readOnly || props.isSaving}
            onChange={(event) => setCreateNotes(event.target.value)}
            placeholder="Safe summary only"
          />

          <button
            type="submit"
            className="primary-button"
            disabled={props.readOnly || props.isSaving}
          >
            {props.readOnly ? "Viewer cannot create" : "Create customer"}
          </button>
        </form>

        <form className="state-card" onSubmit={handleUpdate}>
          <strong>Edit selected customer</strong>
          {!props.customer ? <p>Select a customer before editing.</p> : null}
          <label className="field-label" htmlFor="edit-customer-name">
            Name
          </label>
          <input
            id="edit-customer-name"
            className="text-input"
            value={editDisplayName}
            disabled={!props.customer || props.readOnly || props.isSaving}
            onChange={(event) => setEditDisplayName(event.target.value)}
            placeholder="Customer name"
          />

          <label className="field-label" htmlFor="edit-customer-contact">
            Contact
          </label>
          <input
            id="edit-customer-contact"
            className="text-input"
            value={editContact}
            disabled={!props.customer || props.readOnly || props.isSaving}
            onChange={(event) => setEditContact(event.target.value)}
            placeholder="Email, phone, or handle"
          />

          <label className="field-label" htmlFor="edit-customer-status">
            Status
          </label>
          <select
            id="edit-customer-status"
            className="text-input"
            value={editStatus}
            disabled={!props.customer || props.readOnly || props.isSaving}
            onChange={(event) =>
              setEditStatus(
                event.target.value as CustomerMutationPayload["status"],
              )
            }
          >
            <option value="new">New</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="blocked">Blocked</option>
          </select>

          <label className="field-label" htmlFor="edit-customer-notes">
            Notes preview
          </label>
          <textarea
            id="edit-customer-notes"
            className="text-input"
            value={editNotes}
            disabled={!props.customer || props.readOnly || props.isSaving}
            onChange={(event) => setEditNotes(event.target.value)}
            placeholder="Safe summary only"
          />

          <button
            type="submit"
            className="primary-button"
            disabled={!props.customer || props.readOnly || props.isSaving}
          >
            {props.readOnly ? "Viewer cannot edit" : "Save customer"}
          </button>
        </form>
      </div>

      {formError ? <p className="error-text">{formError}</p> : null}
      {props.mutationError ? (
        <p className="error-text">{props.mutationError}</p>
      ) : null}
      {props.successMessage ? (
        <p className="success-text">{props.successMessage}</p>
      ) : null}
      {props.readOnly ? (
        <div className="state-card">
          <strong>Read-only session</strong>
          <p>
            Viewer sessions can inspect workspace-scoped customers, but create
            and edit actions require backend permission.
          </p>
        </div>
      ) : null}

      <div className="state-card">
        <strong>Selected customer</strong>
        <p>{props.customer?.display_name ?? "No customer selected"}</p>
        <p>{summarizeSource(props.customer)}</p>
      </div>
    </section>
  );
}
