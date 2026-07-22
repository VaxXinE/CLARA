import { useEffect, useMemo, useState, type FormEvent } from "react";
import type {
  CustomerActivityTimelineEvent,
  CustomerFollowUpTask,
  CustomerMutationPayload,
  CustomerNote,
  CustomerProfileResponse,
  WorkspaceMember,
} from "../api/types";

const NOTE_MAX_LENGTH = 2000;
const TASK_BODY_MAX_LENGTH = 2000;
const taskStatuses = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const satisfies ReadonlyArray<{
  value: CustomerFollowUpTask["status"];
  label: string;
}>;
const lifecycleStatuses = [
  { value: "new", label: "New" },
  { value: "active", label: "Active" },
  { value: "follow_up", label: "Follow up" },
  { value: "at_risk", label: "At risk" },
  { value: "resolved", label: "Resolved" },
  { value: "archived", label: "Archived" },
  { value: "blocked", label: "Blocked" },
] as const satisfies ReadonlyArray<{
  value: NonNullable<CustomerMutationPayload["status"]>;
  label: string;
}>;

type CustomerWorkspacePanelProps = {
  customer: CustomerProfileResponse["customer"] | null;
  customers: CustomerProfileResponse["customer"][];
  notes?: CustomerNote[];
  tasks?: CustomerFollowUpTask[];
  timeline?: CustomerActivityTimelineEvent[];
  workspaceMembers?: WorkspaceMember[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  mutationError: string | null;
  noteError?: string | null;
  isSaving: boolean;
  isSavingNote?: boolean;
  readOnly: boolean;
  onSelectCustomer: (customer: CustomerProfileResponse["customer"]) => void;
  onCreateCustomer: (payload: CustomerMutationPayload) => Promise<void>;
  onUpdateCustomer: (
    customerId: string,
    payload: CustomerMutationPayload,
  ) => Promise<void>;
  onUpdateCustomerStatus?: (
    customerId: string,
    status: NonNullable<CustomerMutationPayload["status"]>,
  ) => Promise<void>;
  onAssignCustomerOwner?: (
    customerId: string,
    ownerUserId: string,
  ) => Promise<void>;
  onCreateCustomerNote?: (customerId: string, body: string) => Promise<void>;
  onCreateCustomerFollowUpTask?: (
    customerId: string,
    payload: {
      title: string;
      body?: string | null;
      dueAt?: string | null;
      assigneeUserId?: string | null;
    },
  ) => Promise<void>;
  onUpdateCustomerFollowUpTaskStatus?: (
    customerId: string,
    taskId: string,
    status: CustomerFollowUpTask["status"],
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
  const [lifecycleStatus, setLifecycleStatus] =
    useState<NonNullable<CustomerMutationPayload["status"]>>("new");
  const [ownerUserId, setOwnerUserId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskBody, setTaskBody] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskAssigneeUserId, setTaskAssigneeUserId] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [noteFormError, setNoteFormError] = useState<string | null>(null);

  useEffect(() => {
    setEditDisplayName(props.customer?.display_name ?? "");
    setEditContact(props.customer?.contact_identifier ?? "");
    setEditStatus(
      (props.customer?.status as CustomerMutationPayload["status"]) ?? "new",
    );
    setEditNotes(props.customer?.notes_summary ?? "");
    setLifecycleStatus(
      (props.customer?.status as NonNullable<
        CustomerMutationPayload["status"]
      >) ?? "new",
    );
    setOwnerUserId(props.customer?.owner_user_id ?? "");
  }, [props.customer]);

  const activeWorkspaceMembers = useMemo(
    () =>
      (props.workspaceMembers ?? []).filter(
        (member) => member.status === "active",
      ),
    [props.workspaceMembers],
  );

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

  async function handleLifecycleStatusUpdate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setFormError(null);

    if (!props.customer) {
      setFormError("Select a customer before updating lifecycle status.");
      return;
    }

    await props.onUpdateCustomerStatus?.(props.customer.id, lifecycleStatus);
  }

  async function handleOwnerAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!props.customer) {
      setFormError("Select a customer before assigning an owner.");
      return;
    }

    if (ownerUserId.length === 0) {
      setFormError("Choose an active workspace member before assigning owner.");
      return;
    }

    await props.onAssignCustomerOwner?.(props.customer.id, ownerUserId);
  }

  async function handleCreateNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNoteFormError(null);

    if (!props.customer) {
      setNoteFormError("Select a customer before adding a note.");
      return;
    }

    const body = noteBody.trim();

    if (body.length === 0) {
      setNoteFormError("Note body is required.");
      return;
    }

    if (body.length > NOTE_MAX_LENGTH) {
      setNoteFormError("Note body is too long.");
      return;
    }

    await props.onCreateCustomerNote?.(props.customer.id, body);
    setNoteBody("");
  }

  async function handleCreateFollowUpTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!props.customer) {
      setFormError("Select a customer before creating a follow-up task.");
      return;
    }

    const title = taskTitle.trim();

    if (title.length === 0) {
      setFormError("Follow-up task title is required.");
      return;
    }

    if (taskBody.trim().length > TASK_BODY_MAX_LENGTH) {
      setFormError("Follow-up task body is too long.");
      return;
    }

    await props.onCreateCustomerFollowUpTask?.(props.customer.id, {
      title,
      body: taskBody.trim() || null,
      dueAt: taskDueDate || null,
      assigneeUserId: taskAssigneeUserId || null,
    });

    setTaskTitle("");
    setTaskBody("");
    setTaskDueDate("");
    setTaskAssigneeUserId("");
  }

  async function handleTaskStatusChange(
    task: CustomerFollowUpTask,
    status: CustomerFollowUpTask["status"],
  ) {
    if (!props.customer) return;

    await props.onUpdateCustomerFollowUpTaskStatus?.(
      props.customer.id,
      task.id,
      status,
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
            {lifecycleStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
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
            {lifecycleStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
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
        <p>Status: {props.customer?.status ?? "unknown"}</p>
        <p>Owner user: {props.customer?.owner_user_id ?? "Unassigned"}</p>
      </div>

      <div className="customer-crud-grid">
        <form className="state-card" onSubmit={handleLifecycleStatusUpdate}>
          <strong>Lifecycle status</strong>
          <p>Workspace-scoped internal CRM status update.</p>
          <label className="field-label" htmlFor="customer-lifecycle-status">
            Status
          </label>
          <select
            id="customer-lifecycle-status"
            className="text-input"
            value={lifecycleStatus}
            disabled={!props.customer || props.readOnly || props.isSaving}
            onChange={(event) =>
              setLifecycleStatus(
                event.target.value as NonNullable<
                  CustomerMutationPayload["status"]
                >,
              )
            }
          >
            {lifecycleStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="primary-button"
            disabled={
              !props.customer ||
              props.readOnly ||
              props.isSaving ||
              !props.onUpdateCustomerStatus
            }
          >
            {props.readOnly ? "Viewer cannot update" : "Update status"}
          </button>
        </form>

        <form className="state-card" onSubmit={handleOwnerAssignment}>
          <strong>Owner assignment</strong>
          <p>Owner assignment requires valid workspace membership.</p>
          <label className="field-label" htmlFor="customer-owner-user">
            Active member
          </label>
          <select
            id="customer-owner-user"
            className="text-input"
            value={ownerUserId}
            disabled={
              !props.customer ||
              props.readOnly ||
              props.isSaving ||
              activeWorkspaceMembers.length === 0
            }
            onChange={(event) => setOwnerUserId(event.target.value)}
          >
            <option value="">Choose active member</option>
            {activeWorkspaceMembers.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.email} · {member.role}
              </option>
            ))}
          </select>
          {activeWorkspaceMembers.length === 0 ? (
            <p>
              Member list unavailable. Owner assignment requires valid workspace
              membership.
            </p>
          ) : null}
          <button
            type="submit"
            className="primary-button"
            disabled={
              !props.customer ||
              props.readOnly ||
              props.isSaving ||
              !props.onAssignCustomerOwner ||
              ownerUserId.length === 0
            }
          >
            {props.readOnly ? "Viewer cannot assign" : "Assign owner"}
          </button>
        </form>
      </div>

      <div className="customer-crud-grid">
        <section className="state-card">
          <strong>Follow-up tasks</strong>
          {!props.customer ? (
            <p>Select a customer before creating follow-up tasks.</p>
          ) : null}

          <form onSubmit={handleCreateFollowUpTask}>
            <label className="field-label" htmlFor="customer-task-title">
              Task title
            </label>
            <input
              id="customer-task-title"
              className="text-input"
              value={taskTitle}
              disabled={!props.customer || props.readOnly || props.isSaving}
              maxLength={160}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="Call customer tomorrow"
            />

            <label className="field-label" htmlFor="customer-task-body">
              Details
            </label>
            <textarea
              id="customer-task-body"
              className="text-input"
              value={taskBody}
              disabled={!props.customer || props.readOnly || props.isSaving}
              maxLength={TASK_BODY_MAX_LENGTH}
              onChange={(event) => setTaskBody(event.target.value)}
              placeholder="Safe internal context only"
            />

            <label className="field-label" htmlFor="customer-task-due-date">
              Due date
            </label>
            <input
              id="customer-task-due-date"
              className="text-input"
              type="date"
              value={taskDueDate}
              disabled={!props.customer || props.readOnly || props.isSaving}
              onChange={(event) => setTaskDueDate(event.target.value)}
            />

            <label className="field-label" htmlFor="customer-task-assignee">
              Assignee
            </label>
            <select
              id="customer-task-assignee"
              className="text-input"
              value={taskAssigneeUserId}
              disabled={
                !props.customer ||
                props.readOnly ||
                props.isSaving ||
                activeWorkspaceMembers.length === 0
              }
              onChange={(event) => setTaskAssigneeUserId(event.target.value)}
            >
              <option value="">Unassigned</option>
              {activeWorkspaceMembers.map((member) => (
                <option key={member.user_id} value={member.user_id}>
                  {member.email} · {member.role}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="primary-button"
              disabled={
                !props.customer ||
                props.readOnly ||
                props.isSaving ||
                !props.onCreateCustomerFollowUpTask
              }
            >
              {props.readOnly ? "Viewer cannot add task" : "Create task"}
            </button>
          </form>

          {(props.tasks ?? []).length === 0 ? (
            <p>No follow-up tasks yet.</p>
          ) : null}
          <ol className="timeline-list">
            {(props.tasks ?? []).map((task) => (
              <li key={task.id}>
                <strong>{task.title}</strong>
                {task.body ? <p>{task.body}</p> : null}
                <small>
                  {task.status} · due{" "}
                  {task.due_at
                    ? new Date(task.due_at).toLocaleDateString()
                    : "unscheduled"}{" "}
                  · assignee {task.assignee_user_id ?? "unassigned"}
                </small>
                <select
                  className="text-input"
                  aria-label={`Update ${task.title} status`}
                  value={task.status}
                  disabled={
                    props.readOnly ||
                    props.isSaving ||
                    !props.onUpdateCustomerFollowUpTaskStatus
                  }
                  onChange={(event) =>
                    void handleTaskStatusChange(
                      task,
                      event.target.value as CustomerFollowUpTask["status"],
                    )
                  }
                >
                  {taskStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ol>
        </section>

        <section className="state-card">
          <strong>Customer notes</strong>
          {!props.customer ? (
            <p>Select a customer before adding internal notes.</p>
          ) : null}

          <form onSubmit={handleCreateNote}>
            <label className="field-label" htmlFor="customer-note-body">
              Internal note
            </label>
            <textarea
              id="customer-note-body"
              className="text-input"
              value={noteBody}
              disabled={
                !props.customer || props.readOnly || props.isSavingNote === true
              }
              maxLength={NOTE_MAX_LENGTH}
              onChange={(event) => setNoteBody(event.target.value)}
              placeholder="Add a workspace-scoped internal CRM note"
            />
            <button
              type="submit"
              className="primary-button"
              disabled={
                !props.customer || props.readOnly || props.isSavingNote === true
              }
            >
              {props.isSavingNote ? "Saving note..." : "Add note"}
            </button>
          </form>

          {noteFormError ? <p className="error-text">{noteFormError}</p> : null}
          {props.noteError ? (
            <p className="error-text">{props.noteError}</p>
          ) : null}
          {(props.notes ?? []).length === 0 ? (
            <p>No internal notes yet.</p>
          ) : null}
          <ol className="timeline-list">
            {(props.notes ?? []).map((note) => (
              <li key={note.id}>
                <strong>{new Date(note.created_at).toLocaleString()}</strong>
                <p>{note.body}</p>
                <small>Author: {note.author_user_id}</small>
              </li>
            ))}
          </ol>
        </section>

        <section className="state-card">
          <strong>Customer activity timeline</strong>
          {(props.timeline ?? []).length === 0 ? (
            <p>No customer activity yet.</p>
          ) : null}
          <ol className="timeline-list">
            {(props.timeline ?? []).map((event) => (
              <li key={event.id}>
                <strong>{event.title}</strong>
                <p>{event.summary}</p>
                <small>
                  {event.type} · {new Date(event.occurred_at).toLocaleString()}
                </small>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}
