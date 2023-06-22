import { ChangeEventHandler } from "react";

interface TaskSortOptionArgs {
  onChange: ChangeEventHandler
}

export default function TaskSortOption({onChange}: TaskSortOptionArgs) {
  return (
    <>
      Sort By
      <select onChange={onChange}>
        <option></option>
        <option value="title">Title</option>
        <option value="status">Status</option>
        <option value="dueDate">Due Date</option>
      </select>
    </>
  )
}
